import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from 'remotion';

const COLORS = {
	bg: '#0c0404',
	sauce: '#cc1808',
	sauceLight: '#e82010',
	sauceDark: '#8a0c04',
	sauceGloss: '#ff6050',
	chicken: '#d4922a',
	chickenCrust: '#c08020',
	chickenDark: '#a06810',
	chickenHighlight: '#e8b040',
	bone: '#f0e8d8',
	chili: '#cc2010',
	chiliDark: '#991808',
	parsley: '#2e7d32',
	parsleyLight: '#4caf50',
	flame: '#ff6600',
	flameYellow: '#ffaa00',
	particle: '#ff4400',
};

const SplashDrop: React.FC<{
	angle: number;
	distance: number;
	size: number;
	delay: number;
}> = ({angle, distance, size, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = spring({
		frame: frame - delay,
		fps,
		config: {damping: 20, stiffness: 80},
	});

	const rad = (angle * Math.PI) / 180;
	const x = Math.cos(rad) * distance * progress;
	const y = Math.sin(rad) * distance * progress;
	const gravity = progress * progress * 40;
	const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.6]);
	const scale = interpolate(progress, [0, 0.3, 1], [0.3, 1.2, 0.8]);

	return (
		<div
			style={{
				position: 'absolute',
				left: `calc(50% + ${x}px)`,
				top: `calc(55% + ${y + gravity}px)`,
				width: size,
				height: size * 1.3,
				borderRadius: '40% 40% 50% 50%',
				backgroundColor: COLORS.sauce,
				opacity,
				transform: `scale(${scale}) rotate(${angle + 90}deg)`,
				boxShadow: `0 0 ${size * 0.5}px rgba(200,24,8,0.4)`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: '15%',
					left: '20%',
					width: '30%',
					height: '20%',
					borderRadius: '50%',
					backgroundColor: COLORS.sauceGloss,
					opacity: 0.4,
				}}
			/>
		</div>
	);
};

const SplashRing: React.FC<{delay: number; maxRadius: number}> = ({
	delay,
	maxRadius,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = spring({
		frame: frame - delay,
		fps,
		config: {damping: 25, stiffness: 60},
	});

	const radius = maxRadius * progress;
	const opacity = interpolate(progress, [0, 0.3, 0.8, 1], [0, 0.6, 0.3, 0]);
	const thickness = interpolate(progress, [0, 1], [12, 3]);

	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: '55%',
				width: radius * 2,
				height: radius * 0.6,
				marginLeft: -radius,
				marginTop: -radius * 0.3,
				borderRadius: '50%',
				border: `${thickness}px solid ${COLORS.sauce}`,
				opacity,
			}}
		/>
	);
};

const ChickenDrumstick: React.FC<{
	x: number;
	y: number;
	rotation: number;
	delay: number;
	falling: boolean;
}> = ({x, y, rotation, delay, falling}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	let yOffset = 0;
	let rot = rotation;
	if (falling) {
		const t = Math.max(0, frame - delay);
		yOffset = Math.min(t * t * 0.15, 200);
		rot = rotation + t * 2;
	}

	const scale = spring({
		frame: frame - delay + 10,
		fps,
		config: {damping: 15},
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y + yOffset,
				transform: `rotate(${rot}deg) scale(${scale})`,
				transformOrigin: 'center',
				zIndex: 10,
			}}
		>
			{/* Drumstick body */}
			<div
				style={{
					width: 70,
					height: 110,
					position: 'relative',
				}}
			>
				{/* Meaty part */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 5,
						width: 60,
						height: 75,
						backgroundColor: COLORS.chicken,
						borderRadius: '45% 45% 35% 35%',
						boxShadow: `
              inset -5px -5px 15px rgba(0,0,0,0.3),
              inset 5px 5px 10px ${COLORS.chickenHighlight},
              0 4px 15px rgba(0,0,0,0.5)
            `,
					}}
				>
					{/* Crispy crust texture */}
					{Array.from({length: 8}, (_, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								top: 10 + (i * 17) % 55,
								left: 5 + (i * 23) % 45,
								width: 12 + (i % 3) * 4,
								height: 6 + (i % 2) * 3,
								backgroundColor: COLORS.chickenCrust,
								borderRadius: '40%',
								opacity: 0.5,
								transform: `rotate(${i * 35}deg)`,
							}}
						/>
					))}

					{/* Highlight */}
					<div
						style={{
							position: 'absolute',
							top: 8,
							left: 10,
							width: 20,
							height: 12,
							borderRadius: '50%',
							backgroundColor: COLORS.chickenHighlight,
							opacity: 0.4,
						}}
					/>
				</div>

				{/* Bone */}
				<div
					style={{
						position: 'absolute',
						bottom: 0,
						left: '50%',
						transform: 'translateX(-50%)',
						width: 12,
						height: 40,
						backgroundColor: COLORS.bone,
						borderRadius: '4px 4px 6px 6px',
						boxShadow: 'inset -2px 0 3px rgba(0,0,0,0.1)',
					}}
				>
					{/* Bone knob */}
					<div
						style={{
							position: 'absolute',
							bottom: -4,
							left: '50%',
							transform: 'translateX(-50%)',
							width: 16,
							height: 10,
							backgroundColor: COLORS.bone,
							borderRadius: '50%',
						}}
					/>
				</div>
			</div>
		</div>
	);
};

const ChiliFlake: React.FC<{
	x: number;
	y: number;
	size: number;
	delay: number;
}> = ({x, y, size, delay}) => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - delay);
	const floatY = Math.sin(t * 0.06) * 20;
	const floatX = Math.cos(t * 0.04 + x) * 15;
	const rotation = t * 1.5;
	const opacity = interpolate(t, [0, 15, 80, 120], [0, 1, 0.8, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: x + floatX,
				top: y + floatY,
				width: size,
				height: size * 0.4,
				backgroundColor: COLORS.chili,
				borderRadius: '30%',
				transform: `rotate(${rotation}deg)`,
				opacity,
				boxShadow: `0 0 4px ${COLORS.chiliDark}`,
			}}
		/>
	);
};

const ParsleyLeaf: React.FC<{
	x: number;
	y: number;
	size: number;
	delay: number;
}> = ({x, y, size, delay}) => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - delay);
	const floatY = Math.sin(t * 0.04 + y) * 25;
	const floatX = Math.cos(t * 0.03 + x) * 20;
	const rotation = Math.sin(t * 0.05) * 30;
	const opacity = interpolate(t, [0, 20, 100, 140], [0, 0.9, 0.7, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: x + floatX,
				top: y + floatY,
				width: size,
				height: size * 1.4,
				backgroundColor: COLORS.parsley,
				borderRadius: '50% 50% 50% 0',
				transform: `rotate(${rotation}deg)`,
				opacity,
				boxShadow: `inset 0 0 ${size * 0.3}px ${COLORS.parsleyLight}`,
			}}
		/>
	);
};

const BackgroundFlame: React.FC<{x: number; delay: number}> = ({x, delay}) => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - delay);
	const cycle = t % 40;
	const height = interpolate(cycle, [0, 10, 20, 40], [40, 80, 60, 40]);
	const opacity = interpolate(cycle, [0, 10, 30, 40], [0.3, 0.6, 0.4, 0.3]);

	return (
		<div
			style={{
				position: 'absolute',
				bottom: '30%',
				left: x,
				width: 30,
				height,
				background: `linear-gradient(0deg, ${COLORS.flame} 0%, ${COLORS.flameYellow} 40%, transparent 100%)`,
				borderRadius: '50% 50% 20% 20%',
				opacity,
				filter: 'blur(4px)',
			}}
		/>
	);
};

const GlowingParticle: React.FC<{
	x: number;
	y: number;
	delay: number;
}> = ({x, y, delay}) => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - delay);
	const cycle = t % 60;
	const yDrift = -cycle * 1.5;
	const xDrift = Math.sin(cycle * 0.1 + x) * 10;
	const opacity = interpolate(cycle, [0, 10, 50, 60], [0, 0.8, 0.3, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: x + xDrift,
				top: y + yDrift,
				width: 3,
				height: 3,
				borderRadius: '50%',
				backgroundColor: COLORS.particle,
				opacity,
				boxShadow: `0 0 6px ${COLORS.particle}`,
			}}
		/>
	);
};

export const ChickenSplash: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Camera macro zoom
	const zoom = interpolate(frame, [0, 240], [1, 1.15], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});

	// Impact moment
	const impactFrame = 30;
	const postImpact = Math.max(0, frame - impactFrame);

	// Splash drops
	const splashDrops = Array.from({length: 24}, (_, i) => ({
		angle: (i * 15) + (i % 3) * 5 - 90,
		distance: 80 + (i * 17) % 120,
		size: 8 + (i % 5) * 4,
		delay: impactFrame + (i % 6) * 2,
	}));

	// Chili flakes
	const chiliFlakes = Array.from({length: 15}, (_, i) => ({
		x: 300 + (i * 67) % 700,
		y: 150 + (i * 43) % 300,
		size: 6 + (i % 4) * 3,
		delay: impactFrame + 5 + (i * 4) % 20,
	}));

	// Parsley leaves
	const parsleyLeaves = Array.from({length: 8}, (_, i) => ({
		x: 350 + (i * 97) % 600,
		y: 100 + (i * 53) % 350,
		size: 10 + (i % 3) * 5,
		delay: impactFrame + 10 + (i * 6) % 25,
	}));

	// Flames
	const flames = Array.from({length: 10}, (_, i) => ({
		x: 200 + i * 90,
		delay: i * 5,
	}));

	// Glowing particles
	const particles = Array.from({length: 20}, (_, i) => ({
		x: 250 + (i * 57) % 780,
		y: 400 + (i * 31) % 200,
		delay: i * 7,
	}));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					transform: `scale(${zoom})`,
					transformOrigin: '50% 55%',
				}}
			>
				{/* Dark gradient background */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background:
							'radial-gradient(ellipse at 50% 60%, #1a0808 0%, #0c0404 60%, #060202 100%)',
					}}
				/>

				{/* Background flames */}
				{flames.map((f, i) => (
					<BackgroundFlame key={i} {...f} />
				))}

				{/* Glowing particles */}
				{particles.map((p, i) => (
					<GlowingParticle key={i} {...p} />
				))}

				{/* Sauce pool */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '55%',
						transform: 'translate(-50%, -50%)',
						width: 500,
						height: 150,
						borderRadius: '50%',
						background: `radial-gradient(ellipse, ${COLORS.sauceLight} 0%, ${COLORS.sauce} 40%, ${COLORS.sauceDark} 80%)`,
						boxShadow: `
              0 0 40px rgba(200,24,8,0.3),
              inset 0 0 30px rgba(0,0,0,0.3),
              inset 0 -10px 20px rgba(100,8,0,0.4)
            `,
					}}
				>
					{/* Sauce surface highlights */}
					<div
						style={{
							position: 'absolute',
							top: '15%',
							left: '20%',
							width: '25%',
							height: '30%',
							borderRadius: '50%',
							background: `radial-gradient(ellipse, ${COLORS.sauceGloss} 0%, transparent 70%)`,
							opacity: 0.3,
						}}
					/>
					<div
						style={{
							position: 'absolute',
							top: '25%',
							right: '25%',
							width: '15%',
							height: '20%',
							borderRadius: '50%',
							background: `radial-gradient(ellipse, ${COLORS.sauceGloss} 0%, transparent 70%)`,
							opacity: 0.2,
						}}
					/>
				</div>

				{/* Splash rings */}
				<SplashRing delay={impactFrame} maxRadius={200} />
				<SplashRing delay={impactFrame + 5} maxRadius={280} />
				<SplashRing delay={impactFrame + 10} maxRadius={350} />

				{/* Splash drops */}
				{splashDrops.map((d, i) => (
					<SplashDrop key={i} {...d} />
				))}

				{/* Chicken drumsticks */}
				<ChickenDrumstick
					x={520}
					y={120}
					rotation={-20}
					delay={5}
					falling={frame < impactFrame + 20}
				/>
				<ChickenDrumstick
					x={640}
					y={100}
					rotation={15}
					delay={10}
					falling={frame < impactFrame + 20}
				/>
				<ChickenDrumstick
					x={580}
					y={80}
					rotation={-5}
					delay={0}
					falling={frame < impactFrame + 20}
				/>

				{/* Chili flakes */}
				{chiliFlakes.map((c, i) => (
					<ChiliFlake key={i} {...c} />
				))}

				{/* Parsley leaves */}
				{parsleyLeaves.map((p, i) => (
					<ParsleyLeaf key={i} {...p} />
				))}

				{/* Warm light source glow */}
				<div
					style={{
						position: 'absolute',
						top: '-10%',
						left: '40%',
						width: 400,
						height: 200,
						borderRadius: '50%',
						background:
							'radial-gradient(ellipse, rgba(255,140,40,0.1) 0%, transparent 70%)',
						pointerEvents: 'none',
					}}
				/>
			</div>

			{/* Dramatic vignette */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						'radial-gradient(ellipse at 50% 55%, transparent 25%, rgba(0,0,0,0.7) 100%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Heat atmosphere */}
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: '40%',
					background:
						'linear-gradient(0deg, rgba(200,24,8,0.05) 0%, transparent 100%)',
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};
