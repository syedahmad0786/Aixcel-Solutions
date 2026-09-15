import {clamp, scrollProgress, phaseAt} from './motion-math.mjs';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const moving = () => !reduced.matches && !document.body.classList.contains('motion-paused');
const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');
const stories = [...document.querySelectorAll('[data-system-story]')];
const shots = [...document.querySelectorAll('.work-card .visual, .detail-art, .portrait-frame, .proof-screenshot')];
let frame = 0;

function animate(element, keyframes, options) {
  if (element && moving()) return element.animate(keyframes, {duration:900,easing:'cubic-bezier(.2,.72,.16,1)',...options});
}

// One opening sequence. Content stays visible if scripts or motion are unavailable.
document.querySelectorAll('.title-line > span').forEach((line,i) => animate(line,[{transform:'translateY(110%)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:1100,delay:80+i*130}));
animate(hero?.querySelector('.eyebrow'),[{opacity:0},{opacity:1}],{duration:800});
animate(hero?.querySelector('.deck'),[{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{delay:220});
animate(hero?.querySelector('.art-window'),[{opacity:0,clipPath:'inset(8% 6% 8% 6% round 40px)'},{opacity:1,clipPath:'inset(0% 0% 0% 0% round 20px)'}],{duration:1400,delay:100});

function update() {
  frame = 0;
  root.style.setProperty('--page-progress',clamp(scrollY / Math.max(1,root.scrollHeight-innerHeight)).toFixed(4));
  header?.classList.toggle('scrolled',scrollY>50);
  if(hero && moving()) {
    const p = clamp(-hero.getBoundingClientRect().top / innerHeight);
    const img=hero.querySelector('.art-window img');
    if(img)img.style.transform=`scale(${1.06+p*.1}) translateY(${p*18}px)`;
  }
  for(const story of stories) {
    if(story.manual || !moving() || story.classList.contains('compact') || innerWidth<801)continue;
    const r=story.getBoundingClientRect();
    if(r.bottom<0||r.top>innerHeight)continue;
    setProgress(story,scrollProgress(r.top-96,r.height,innerHeight-96));
  }
}
function wake(){if(!frame)frame=requestAnimationFrame(update);}
addEventListener('scroll',wake,{passive:true});
addEventListener('resize',wake,{passive:true});
wake();

// Native scrolling remains in control; the model follows the same page position.
function setProgress(story,value) {
  const p=clamp(value), phase=phaseAt(p);
  story.progress=p;
  story.dataset.phase=String(phase);
  story.style.setProperty('--story-progress',p);
  story.querySelector('.scene-scrub').value=String(Math.round(p*100));
  story.querySelectorAll('[data-phase]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.phase)===phase)));
  story.querySelectorAll('[data-chapter]').forEach(chapter=>chapter.classList.toggle('current',Number(chapter.dataset.chapter)===phase));
  story.scene?.setProgress(p);
}
for (const story of stories) {
  setProgress(story,0);
  story.querySelectorAll('[data-phase]').forEach(button=>button.addEventListener('click',()=>{story.manual=true;setProgress(story,Number(button.dataset.phase)/2);}));
  story.querySelector('.scene-scrub').addEventListener('input',event=>{story.manual=true;setProgress(story,Number(event.target.value)/100);});
  story.querySelector('.follow-scroll').addEventListener('click',()=>{story.manual=false;wake();});
}

if('IntersectionObserver' in window) {
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    reveal.unobserve(entry.target);
    animate(entry.target,[{clipPath:'inset(5% 3% 5% 3% round 24px)',opacity:.6},{clipPath:'inset(0% 0% 0% 0% round 18px)',opacity:1}],{duration:1000});
  }),{threshold:.16});
  shots.forEach(shot=>reveal.observe(shot));
  const lazy=new IntersectionObserver(entries=>entries.forEach(async entry=>{
    if(!entry.isIntersecting)return;
    lazy.unobserve(entry.target);
    const story=entry.target;
    if(navigator.connection?.saveData){story.querySelector('.scene-status').textContent='Data-saving view';return;}
    try {
      const {createSystemScene}=await import('./system-scene.js');
      story.scene=createSystemScene(story,()=>!moving());
      story.scene.setProgress(story.progress||0);
    } catch(error) {
      story.querySelector('.scene-status').textContent='Artwork view';
      story.classList.add('scene-unavailable');
      console.warn('3D scene unavailable; readable artwork and workflow retained.',error);
    }
  }),{rootMargin:'500px 0px'});
  stories.forEach(story=>lazy.observe(story));
}

// The photographic frame responds gently; the logo and text never rotate.
document.querySelectorAll('.hero-art').forEach(stage=>{
  const window=stage.querySelector('.art-window');
  stage.addEventListener('pointermove',e=>{
    if(!moving()||!finePointer.matches)return;
    const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    window.style.transform=`perspective(1500px) rotateY(${x*9}deg) rotateX(${-y*6}deg) translateY(-3px)`;
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{window.style.transform='';});
});

function syncMotion(){
  root.style.scrollBehavior=moving()?'':'auto';
  if(!moving()){
    document.getAnimations().forEach(a=>{if(Number.isFinite(a.effect?.getComputedTiming().endTime))a.finish();else a.cancel();});
    hero?.querySelectorAll('.art-window,.art-window img').forEach(el=>el.style.transform='');
  }
  stories.forEach(story=>story.scene?.refresh());
  wake();
}
new MutationObserver(syncMotion).observe(document.body,{attributes:true,attributeFilter:['class']});
reduced.addEventListener('change',syncMotion);
document.addEventListener('visibilitychange',()=>stories.forEach(story=>story.scene?.refresh()));

// Mobile links close their menu immediately; keyboard dismissal remains in site.js.
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{
  document.querySelector('.nav').classList.remove('open');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');
}));
addEventListener('pagehide',()=>stories.forEach(story=>story.scene?.pause()));
addEventListener('pageshow',()=>stories.forEach(story=>story.scene?.refresh()));
