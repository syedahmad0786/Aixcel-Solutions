import {Composition} from 'remotion';
import {MyAnimation as BarChartAnimation} from '../skills/remotion/rules/assets/charts-bar-chart';
import {MyAnimation as TypewriterAnimation} from '../skills/remotion/rules/assets/text-animations-typewriter';
import {MyAnimation as WordHighlightAnimation} from '../skills/remotion/rules/assets/text-animations-word-highlight';
import {FriesMonster} from './compositions/FriesMonster';
import {BurgerExplosion} from './compositions/BurgerExplosion';
import {PizzaAerial} from './compositions/PizzaAerial';
import {GrilledSteak} from './compositions/GrilledSteak';
import {VolcanicBurger} from './compositions/VolcanicBurger';
import {ChickenSplash} from './compositions/ChickenSplash';

export const RemotionRoot = () => {
	return (
		<>
			{/* === Original Skills Examples === */}
			<Composition
				id="BarChart"
				component={BarChartAnimation}
				durationInFrames={120}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="Typewriter"
				component={TypewriterAnimation}
				durationInFrames={180}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					fullText: 'From prompt to motion graphics. This is Remotion.',
					pauseAfter: 'From prompt to motion graphics.',
				}}
			/>
			<Composition
				id="WordHighlight"
				component={WordHighlightAnimation}
				durationInFrames={90}
				fps={30}
				width={1080}
				height={1080}
			/>

			{/* === Food Fantasy Compositions === */}

			{/* 01 - Dark fantasy french fries monster */}
			<Composition
				id="FriesMonster"
				component={FriesMonster}
				durationInFrames={240}
				fps={30}
				width={1280}
				height={720}
			/>

			{/* 02 - Giant burgers floating in cityscape explosion */}
			<Composition
				id="BurgerExplosion"
				component={BurgerExplosion}
				durationInFrames={240}
				fps={30}
				width={1280}
				height={720}
			/>

			{/* 03 - Aerial pizza over city intersection */}
			<Composition
				id="PizzaAerial"
				component={PizzaAerial}
				durationInFrames={300}
				fps={30}
				width={1280}
				height={720}
			/>

			{/* 04 - Grilled steak with sauce pour macro shot */}
			<Composition
				id="GrilledSteak"
				component={GrilledSteak}
				durationInFrames={300}
				fps={30}
				width={1280}
				height={720}
			/>

			{/* 05 - Volcanic burger with lava cheese */}
			<Composition
				id="VolcanicBurger"
				component={VolcanicBurger}
				durationInFrames={300}
				fps={30}
				width={1280}
				height={720}
			/>

			{/* 06 - Chicken drumsticks splashing into spicy sauce */}
			<Composition
				id="ChickenSplash"
				component={ChickenSplash}
				durationInFrames={240}
				fps={30}
				width={1280}
				height={720}
			/>
		</>
	);
};
