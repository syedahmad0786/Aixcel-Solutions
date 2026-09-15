import * as THREE from './vendor/three.module.min.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {clamp,mix,smooth,damp} from './motion-math.mjs';

export function createSystemScene(story,isPaused) {
  const viewport=story.querySelector('.scene-viewport'),mount=story.querySelector('.scene-canvas');
  const ab=story.dataset.brand==='ahmad';
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<801?1.25:1.5));
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.92;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();scene.background=new THREE.Color(ab?'#e4e9f2':'#e4ece1');
  const camera=new THREE.PerspectiveCamera(34,1,.1,60);camera.zoom=ab?1.5:1.3;camera.position.set(7,5.3,9.7);camera.lookAt(0,.15,0);
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
  const environment=pmrem.fromScene(room,.035);scene.environment=environment.texture;room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff,ab?0x7e90b0:0x748b74,.9));
  const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);
  key.shadow.camera.left=-6;key.shadow.camera.right=6;key.shadow.camera.top=6;key.shadow.camera.bottom=-6;
  key.shadow.normalBias=.025;key.shadow.bias=-.0002;key.shadow.radius=4;scene.add(key);
  const rim=new THREE.DirectionalLight(ab?0x8faaff:0xc8eaa2,2.5);rim.position.set(5,3,-4);scene.add(rim);
  const metal=new THREE.MeshStandardMaterial({color:ab?0xb9c5d8:0xbccbbb,metalness:.96,roughness:.23});
  const porcelain=new THREE.MeshStandardMaterial({color:0xeef2f4,metalness:.3,roughness:.29});
  const glass=new THREE.MeshPhysicalMaterial({color:ab?0x3162de:0x438457,metalness:0,roughness:.1,transmission:.92,thickness:.9,ior:1.48,clearcoat:1,clearcoatRoughness:.09,envMapIntensity:1.4});
  const signal=new THREE.MeshStandardMaterial({color:ab?0x304fea:0xbacf66,metalness:.35,roughness:.22,emissive:ab?0x1c328b:0x56701c,emissiveIntensity:.16});
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshStandardMaterial({color:ab?0xe4e9f2:0xe4ece1,roughness:.65,metalness:.06}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-2.6;floor.receiveShadow=true;scene.add(floor);
  const assembly=new THREE.Group();scene.add(assembly);
  function slab(w,h,d,material) {
    const r=Math.min(.16,w/5,h/5),shape=new THREE.Shape();
    shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
    shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);
    shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);
    shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
    const geometry=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.04,bevelThickness:.04,curveSegments:10});geometry.translate(0,0,-d/2);
    const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
  }
  const layers=[];
  if(ab) {
    for(let i=0;i<3;i++) {
      const layer=new THREE.Group(),plate=slab(3.1,2.25,.17,metal);plate.rotation.x=-Math.PI/2;layer.add(plate);
      const pane=slab(2.66,1.8,.23,glass);pane.rotation.x=-Math.PI/2;pane.position.y=.28;layer.add(pane);
      const node=new THREE.Mesh(new THREE.SphereGeometry(.16,24,16),signal);node.position.set(.95,.52,.57);node.castShadow=true;layer.add(node);
      for(const x of [-1.24,1.24])for(const z of [-.86,.86]){const pin=new THREE.Mesh(new THREE.CylinderGeometry(.038,.038,.38,10),porcelain);pin.position.set(x,.17,z);layer.add(pin);}
      assembly.add(layer);layers.push(layer);
    }
    const base=slab(3.55,2.7,.25,porcelain);base.rotation.x=-Math.PI/2;base.position.y=-1.55;assembly.add(base);
  } else {
    for(let i=0;i<3;i++) {
      const part=new THREE.Group(),loop=new THREE.Mesh(new THREE.TorusGeometry(1.1,.17,20,80),i===1?metal:glass);
      loop.rotation.y=Math.PI/2;loop.castShadow=true;part.add(loop);
      const foot=slab(.7,1.6,.15,metal);foot.rotation.x=-Math.PI/2;foot.position.y=-1.28;part.add(foot);assembly.add(part);layers.push(part);
    }
    const gate=slab(.8,1.7,.16,glass);gate.position.set(0,.1,0);gate.rotation.y=Math.PI/2;assembly.add(gate);layers.push(gate);
  }
  const traveller=new THREE.Mesh(new THREE.SphereGeometry(ab?.25:.29,32,24),signal);traveller.castShadow=true;assembly.add(traveller);
  mount.appendChild(renderer.domElement);story.classList.add('scene-ready');story.querySelector('.scene-status').textContent='Interactive 3D';
  let target=0,display=0,frame=0,last=performance.now(),elapsed=0,visible=false,stopped=false,lost=false,yaw=0,pitch=0,drag=null;
  function render(now) {
    frame=0;const dt=clamp((now-last)/1000,0,.05);last=now;const paused=isPaused();if(!paused)elapsed+=dt;
    display=paused?target:damp(display,target,dt);if(Math.abs(target-display)<.0001)display=target;
    const spread=smooth(display<.5?display*2:1);
    assembly.rotation.y=(ab?-.25:-.45)+yaw+display*.7+(paused?0:Math.sin(elapsed*.28)*.05);assembly.rotation.x=pitch;
    if(ab) {
      layers.forEach((layer,i)=>{layer.position.set((i-1)*spread*.24,-1.2+i*mix(.49,1.15,spread),0);layer.rotation.y=(i-1)*spread*.17;});
      traveller.position.set(mix(-2.2,1.55,display),mix(.4,1.65,smooth(display)),mix(.5,.3,display));
    }else {
      layers.slice(0,3).forEach((layer,i)=>{layer.position.x=(i-1)*mix(.65,1.8,spread);layer.rotation.y=(i-1)*spread*.18;});
      layers[3].rotation.y=Math.PI/2-smooth((display-.5)*2)*Math.PI*.45;traveller.position.set(mix(-2.9,2.9,display),.05,0);
    }
    camera.position.z=mix(9.7,11.4,spread)*Math.max(1,.85/camera.aspect);camera.lookAt(0,.15,0);renderer.render(scene,camera);
    if(visible&&!stopped&&!lost&&!document.hidden&&(!paused||display!==target))wake();
  }
  function wake(){if(!frame&&!lost&&!stopped&&!document.hidden){last=performance.now();frame=requestAnimationFrame(render);}}
  function resize(){const r=viewport.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();wake();}
  new ResizeObserver(resize).observe(viewport);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(frame);frame=0;}},{threshold:.01}).observe(viewport);
  viewport.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={x:event.clientX,y:event.clientY,yaw,pitch};viewport.setPointerCapture(event.pointerId);});
  viewport.addEventListener('pointermove',event=>{if(!drag)return;yaw=drag.yaw+(event.clientX-drag.x)*.007;pitch=clamp(drag.pitch+(event.clientY-drag.y)*.003,-.4,.4);wake();});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(type,()=>{drag=null;});
  viewport.addEventListener('keydown',event=>{if(event.target!==viewport||!['ArrowLeft','ArrowRight','Home'].includes(event.key))return;event.preventDefault();if(event.key==='Home'){yaw=pitch=0;}else yaw+=event.key==='ArrowLeft'?-.2:.2;wake();});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;cancelAnimationFrame(frame);frame=0;story.classList.remove('scene-ready');story.querySelector('.scene-status').textContent='Artwork view';});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{lost=false;story.classList.add('scene-ready');story.querySelector('.scene-status').textContent='Interactive 3D';wake();});
  resize();return{setProgress(value){target=clamp(value);wake();},refresh(){stopped=false;wake();},pause(){stopped=true;cancelAnimationFrame(frame);frame=0;}};
}
