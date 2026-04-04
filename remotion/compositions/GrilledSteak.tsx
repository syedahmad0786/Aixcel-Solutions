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
	bg: '#0a0a0a',
	surface: '#111111',
	surfaceGloss: 'rgba(255,255,255,0.05)',
	steak: '#6b3520',
	steakCrust: '#3a1a0c',
	steakHighlight: '#8b4530',
	grill: '#1a0c06',
	sauce: '#e8c840',
	sauceDark: '#c49820',
	sauceGloss: '#fff8d0',
	tomato: '#cc2222',
	tomatoInner: '#e85050',
	onion: '#e8d8c8',
	onionPearl: '#f0e8e0',
	sesame: '#e8d0a0',
	warmLight: 'rgba(255,160,60,0.15)',
	steam: 'rgba(200,200,200,0.12)',
};

const GrillMark: React.FC<{x: number; width: number; angle: number}> = ({
	x,
	width,
	angle,
}) => (
	<div
		style={{
			position: 'absolute',
			top: '10%',
			left: x,
			width,
			height: '80%',
			backgroundColor: COLORS.grill,
			transform: `rotate(${angle}deg)`,
			borderRadius: 3,
			opacity: 0.7,
		}}
	/>
);

const FallingParticle: React.FC<{
	x: number;
	delay: number;
	size: number;
	color: string;
	speed: number;
}> = ({x, delay, size, color, speed}) => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - delay);
	const cycle = t % 120;
	const yPos = cycle * speed;
	const opacity = interpolate(cycle, [0, 20, 100, 120], [0, 1, 1, 0], {
		extrapolateRight: 'clamp',
	});
	const wobble = Math.sin(cycle * 0.1 + x) * 8;

	return (
		<div
			style={{
				position: 'absolute',
				left: x + wobble,
				top: yPos - 50,
				width: size,
				height: size,
				borderRadius: size > 4 ? '50%' : '30%',
				backgroundColor: color,
				opacity,
				transform: `rotate(${cycle * 2}deg)`,
			}}
		/>
	);
};

const SteamWisp: React.FC<{x: number; delay: number}> = ({x, delay}) => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - delay);
	const yOffset = -t * 0.8;
	const xDrift = Math.sin(t * 0.05 + x) * 20;
	const opacity = interpolate(t % 90, [0, 20, 70, 90], [0, 0.15, 0.08, 0], {
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(t % 90, [0, 90], [0.5, 2], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: x + xDrift,
				top: 250 + (yOffset % 200),
				width: 60,
				height: 40,
				borderRadius: '50%',
				backgroundColor: COLORS.steam,
				opacity,
				transform: `scale(${scale})`,
				filter: 'blur(12px)',
			}}
		/>
	);
};

const CherryTomato: React.FC<{x: number; y: number; cut: boolean}> = ({
	x,
	y,
	cut,
}) => {
	const size = 32;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: size,
				height: cut ? size / 2 : size,
				borderRadius: cut ? `${size}px ${size}px 2px 2px` : '50%',
				backgroundColor: COLORS.tomato,
				boxShadow: `
          inset -3px -3px 6px rgba(0,0,0,0.3),
          0 2px 8px rgba(0,0,0,0.4),
          inset 4px 4px 8px rgba(255,100,100,0.2)
        `,
				overflow: 'hidden',
			}}
		>
			{cut && (
				<div
					style={{
						position: 'absolute',
						bottom: 0,
						left: '15%',
						right: '15%',
						height: '60%',
						backgroundColor: COLORS.tomatoInner,
						borderRadius: '2px',
					}}
				/>
			)}
			{/* Highlight */}
			<div
				style={{
					position: 'absolute',
					top: 4,
					left: 6,
					width: 8,
					height: 6,
					borderRadius: '50%',
					backgroundColor: 'rgba(255,255,255,0.25)',
				}}
			/>
		</div>
	);
};

const PearlOnion: React.FC<{x: number; y: number}> = ({x, y}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			width: 18,
			height: 18,
			borderRadius: '50%',
			backgroundColor: COLORS.onionPearl,
			boxShadow: `
        inset -2px -2px 4px rgba(0,0,0,0.15),
        0 2px 6px rgba(0,0,0,0.3),
        inset 2px 2px 4px rgba(255,255,255,0.3)
      `,
		}}
	>
		<div
			style={{
				position: 'absolute',
				top: 3,
				left: 5,
				width: 5,
				height: 4,
				borderRadius: '50%',
				backgroundColor: 'rgba(255,255,255,0.4)',
			}}
		/>
	</div>
);

export const GrilledSteak: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Slow push-in
	const zoom = interpolate(frame, [0, 300], [1, 1.2], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});

	// Sauce pour animation
	const saucePour = interpolate(frame, [30, 180], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});

	const sauceWidth = interpolate(saucePour, [0, 0.3, 0.7, 1], [0, 60, 140, 180]);
	const sauceDrip1 = interpolate(saucePour, [0.3, 0.8], [0, 40], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const sauceDrip2 = interpolate(saucePour, [0.5, 1], [0, 55], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Warm light flicker
	const flicker = interpolate(
		Math.sin(frame * 0.15) + Math.sin(frame * 0.23),
		[-2, 2],
		[0.8, 1],
	);

	// Falling particles
	const seasoningParticles = Array.from({length: 30}, (_, i) => ({
		x: 350 + (i * 37) % 400,
		delay: i * 8,
		size: 1 + (i % 3),
		color: i % 3 === 0 ? COLORS.sesame : i % 3 === 1 ? '#888' : '#aaa',
		speed: 2 + (i % 3),
	}));

	const steamWisps = Array.from({length: 6}, (_, i) => ({
		x: 380 + i * 60,
		delay: i * 15,
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
					transformOrigin: '55% 55%',
				}}
			>
				{/* Glossy black surface */}
				<div
					style={{
						position: 'absolute',
						top: '45%',
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: COLORS.surface,
						background: `linear-gradient(180deg, #0e0e0e 0%, ${COLORS.surface} 20%, #0a0a0a 100%)`,
					}}
				>
					{/* Surface reflection */}
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: '20%',
							right: '20%',
							height: 2,
							background:
								'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
						}}
					/>
				</div>

				{/* Warm lighting */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: `radial-gradient(ellipse at 55% 40%, rgba(255,160,60,${0.12 * flicker}) 0%, transparent 60%)`,
						pointerEvents: 'none',
					}}
				/>

				{/* Steam */}
				{steamWisps.map((s, i) => (
					<SteamWisp key={i} {...s} />
				))}

				{/* STEAK */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '48%',
						transform: 'translate(-50%, -50%)',
						width: 380,
						height: 200,
					}}
				>
					{/* Steak shadow */}
					<div
						style={{
							position: 'absolute',
							bottom: -15,
							left: 10,
							right: 10,
							height: 30,
							borderRadius: '50%',
							background: 'rgba(0,0,0,0.5)',
							filter: 'blur(10px)',
						}}
					/>

					{/* Main steak body */}
					<div
						style={{
							width: '100%',
							height: '100%',
							backgroundColor: COLORS.steak,
							borderRadius: '45% 50% 48% 44%',
							position: 'relative',
							boxShadow: `
                inset 0 -10px 20px rgba(0,0,0,0.4),
                inset 0 10px 20px rgba(200,100,50,0.15),
                0 5px 20px rgba(0,0,0,0.6)
              `,
							overflow: 'hidden',
						}}
					>
						{/* Crust texture */}
						<div
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								height: '35%',
								background: `linear-gradient(180deg, ${COLORS.steakCrust} 0%, transparent 100%)`,
								borderRadius: '45% 50% 0 0',
							}}
						/>

						{/* Meat highlights */}
						<div
							style={{
								position: 'absolute',
								top: '20%',
								left: '15%',
								width: '30%',
								height: '25%',
								backgroundColor: COLORS.steakHighlight,
								borderRadius: '50%',
								opacity: 0.4,
								filter: 'blur(8px)',
							}}
						/>

						{/* Grill marks */}
						<GrillMark x={60} width={8} angle={-30} />
						<GrillMark x={120} width={7} angle={-30} />
						<GrillMark x={180} width={8} angle={-30} />
						<GrillMark x={240} width={7} angle={-30} />
						<GrillMark x={300} width={8} angle={-30} />
					</div>

					{/* Sauce on top */}
					<div
						style={{
							position: 'absolute',
							top: '15%',
							left: `calc(50% - ${sauceWidth / 2}px)`,
							width: sauceWidth,
							height: 40,
							borderRadius: '40%',
							background: `radial-gradient(ellipse, ${COLORS.sauce} 0%, ${COLORS.sauceDark} 80%)`,
							opacity: saucePour > 0.05 ? 1 : 0,
							boxShadow: `
                0 2px 8px rgba(0,0,0,0.3),
                inset 0 3px 8px rgba(255,255,200,0.3)
              `,
						}}
					>
						{/* Sauce gloss */}
						<div
							style={{
								position: 'absolute',
								top: 4,
								left: '20%',
								width: '30%',
								height: 8,
								borderRadius: '50%',
								backgroundColor: COLORS.sauceGloss,
								opacity: 0.4,
							}}
						/>
					</div>

					{/* Sauce drips */}
					<div
						style={{
							position: 'absolute',
							top: '40%',
							right: '25%',
							width: 12,
							height: sauceDrip1,
							borderRadius: '0 0 6px 6px',
							background: `linear-gradient(180deg, ${COLORS.sauce}, ${COLORS.sauceDark})`,
						}}
					/>
					<div
						style={{
							position: 'absolute',
							top: '35%',
							left: '20%',
							width: 10,
							height: sauceDrip2,
							borderRadius: '0 0 5px 5px',
							background: `linear-gradient(180deg, ${COLORS.sauce}, ${COLORS.sauceDark})`,
						}}
					/>
				</div>

				{/* Garnishes around steak */}
				<CherryTomato x={280} y={410} cut />
				<CherryTomato x={750} y={430} cut />
				<CherryTomato x={820} y={380} cut={false} />
				<CherryTomato x={340} y={450} cut={false} />

				<PearlOnion x={380} y={440} />
				<PearlOnion x={700} y={420} />
				<PearlOnion x={480} y={470} />
				<PearlOnion x={620} y={460} />
				<PearlOnion x={760} y={460} />

				{/* Falling seasoning/sesame */}
				{seasoningParticles.map((p, i) => (
					<FallingParticle key={i} {...p} />
				))}

				{/* Sauce stream from above */}
				{saucePour > 0.02 && saucePour < 0.9 && (
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: '53%',
							width: 8,
							height: '42%',
							background: `linear-gradient(180deg, transparent 0%, ${COLORS.sauce} 30%, ${COLORS.sauceDark} 100%)`,
							borderRadius: 4,
							opacity: interpolate(saucePour, [0.02, 0.1, 0.8, 0.9], [0, 0.8, 0.8, 0]),
						}}
					/>
				)}
			</div>

			{/* Warm vignette */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						'radial-gradient(ellipse at 55% 45%, transparent 30%, rgba(0,0,0,0.6) 100%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Orange highlight rim */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						'radial-gradient(ellipse at 70% 30%, rgba(255,140,40,0.06) 0%, transparent 40%)',
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};
