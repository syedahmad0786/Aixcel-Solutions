import {registerRoot} from 'remotion';
import {Composition} from 'remotion';
import {FriesMonster} from './compositions/FriesMonster';
import {BurgerExplosion} from './compositions/BurgerExplosion';
import {PizzaAerial} from './compositions/PizzaAerial';
import {GrilledSteak} from './compositions/GrilledSteak';
import {VolcanicBurger} from './compositions/VolcanicBurger';
import {ChickenSplash} from './compositions/ChickenSplash';

const FoodRoot = () => {
	return (
		<>
			<Composition
				id="FriesMonster"
				component={FriesMonster}
				durationInFrames={240}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="BurgerExplosion"
				component={BurgerExplosion}
				durationInFrames={240}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="PizzaAerial"
				component={PizzaAerial}
				durationInFrames={300}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="GrilledSteak"
				component={GrilledSteak}
				durationInFrames={300}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="VolcanicBurger"
				component={VolcanicBurger}
				durationInFrames={300}
				fps={30}
				width={1280}
				height={720}
			/>
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

registerRoot(FoodRoot);
