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
	sky: '#4a8cd4',
	skyLight: '#7cb5e8',
	building: '#2a3040',
	buildingLight: '#3a4050',
	glass: 'rgba(120,180,240,0.3)',
	bunTop: '#d4922a',
	bunBottom: '#c07818',
	sesame: '#f5e8c0',
	lettuce: '#4caf50',
	tomato: '#e53935',
	cheese: '#ffc107',
	patty: '#4a2a18',
	explosion: '#ff6600',
	explosionLight: '#ffaa00',
	smoke: '#555',
	debris: '#c08820',
	street: '#3a3a3a',
};

const Building: React.FC<{
	x: number;
	width: number;
	height: number;
	color: string;
}> = ({x, width, height, color}) => {
	const windowRows = Math.floor(height / 30);
	const windowCols = Math.floor(width / 25);

	return (
		<div
			style={{
				position: 'absolute',
				bottom: '15%',
				left: x,
				width,
				height,
				backgroundColor: color,
				boxShadow: 'inset -8px 0 20px rgba(0,0,0,0.3)',
			}}
		>
			{Array.from({length: windowRows * windowCols}, (_, i) => {
				const row = Math.floor(i / windowCols);
				const col = i % windowCols;
				const lit = Math.random() > 0.3;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							top: 15 + row * 30,
							left: 8 + col * 25,
							width: 14,
							height: 18,
							backgroundColor: lit ? COLORS.glass : 'rgba(20,30,50,0.8)',
							boxShadow: lit
								? '0 0 4px rgba(120,180,240,0.4)'
								: 'none',
						}}
					/>
				);
			})}
		</div>
	);
};

const Burger: React.FC<{
	x: number;
	y: number;
	size: number;
	rotation: number;
	floatPhase: number;
}> = ({x, y, size, rotation, floatPhase}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const floatY = Math.sin(frame * 0.04 + floatPhase) * 12;
	const scale = spring({frame: frame - 10, fps, config: {damping: 15}});
	const s = size;

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y + floatY,
				transform: `rotate(${rotation}deg) scale(${scale})`,
				transformOrigin: 'center',
				width: s,
				height: s * 0.7,
			}}
		>
			{/* Top bun */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: '5%',
					width: '90%',
					height: '30%',
					backgroundColor: COLORS.bunTop,
					borderRadius: '50% 50% 5px 5px',
					boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.2)',
				}}
			>
				{/* Sesame seeds */}
				{[15, 35, 55, 75, 25, 65].map((left, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							top: i < 4 ? '15%' : '40%',
							left: `${left}%`,
							width: s * 0.04,
							height: s * 0.06,
							backgroundColor: COLORS.sesame,
							borderRadius: '40%',
							transform: `rotate(${i * 30}deg)`,
						}}
					/>
				))}
			</div>

			{/* Lettuce */}
			<div
				style={{
					position: 'absolute',
					top: '28%',
					left: '2%',
					width: '96%',
					height: '12%',
					backgroundColor: COLORS.lettuce,
					borderRadius: '2px',
					clipPath:
						'polygon(0% 50%, 5% 20%, 12% 60%, 20% 10%, 28% 50%, 35% 15%, 42% 55%, 50% 10%, 58% 50%, 65% 20%, 72% 55%, 80% 15%, 88% 50%, 95% 25%, 100% 50%, 100% 100%, 0% 100%)',
				}}
			/>

			{/* Tomato */}
			<div
				style={{
					position: 'absolute',
					top: '38%',
					left: '8%',
					width: '84%',
					height: '8%',
					backgroundColor: COLORS.tomato,
					borderRadius: '2px',
				}}
			/>

			{/* Cheese (melting) */}
			<div
				style={{
					position: 'absolute',
					top: '44%',
					left: '3%',
					width: '94%',
					height: '10%',
					backgroundColor: COLORS.cheese,
					clipPath:
						'polygon(0% 0%, 100% 0%, 100% 40%, 95% 100%, 85% 50%, 75% 90%, 65% 40%, 55% 100%, 45% 50%, 35% 80%, 25% 40%, 15% 100%, 5% 60%, 0% 40%)',
				}}
			/>

			{/* Patty */}
			<div
				style={{
					position: 'absolute',
					top: '52%',
					left: '7%',
					width: '86%',
					height: '15%',
					backgroundColor: COLORS.patty,
					borderRadius: '4px',
					boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.4)',
				}}
			/>

			{/* Bottom bun */}
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: '7%',
					width: '86%',
					height: '22%',
					backgroundColor: COLORS.bunBottom,
					borderRadius: '4px 4px 40% 40%',
					boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.2)',
				}}
			/>
		</div>
	);
};

const Debris: React.FC<{x: number; delay: number; size: number}> = ({
	x,
	delay,
	size,
}) => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - delay);
	const yPos = interpolate(t, [0, 60], [0, 300], {extrapolateRight: 'clamp'});
	const gravity = t * t * 0.02;
	const rotation = t * (3 + (x % 5));
	const opacity = interpolate(t, [0, 10, 50, 60], [0, 1, 1, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: 500 - yPos + gravity,
				width: size,
				height: size * 0.6,
				backgroundColor: COLORS.debris,
				borderRadius: '30%',
				transform: `rotate(${rotation}deg)`,
				opacity,
			}}
		/>
	);
};

const Explosion: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const expand = spring({
		frame: frame - 20,
		fps,
		config: {damping: 12, stiffness: 40},
	});
	const opacity = interpolate(frame, [20, 40, 120, 180], [0, 0.9, 0.7, 0], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				bottom: '12%',
				left: '50%',
				transform: `translate(-50%, 50%) scale(${expand})`,
				width: 500,
				height: 300,
				opacity,
			}}
		>
			{/* Fire core */}
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: '50%',
					transform: 'translateX(-50%)',
					width: 300,
					height: 200,
					borderRadius: '50%',
					background: `radial-gradient(ellipse, ${COLORS.explosionLight} 0%, ${COLORS.explosion} 40%, rgba(180,40,0,0.6) 70%, transparent 100%)`,
				}}
			/>
			{/* Smoke plumes */}
			{[0, 1, 2, 3].map((i) => {
				const smokeY = interpolate(
					frame - 30,
					[0, 120],
					[0, -150 - i * 40],
					{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
				);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							bottom: 100 - smokeY,
							left: 100 + i * 70,
							width: 100 + i * 20,
							height: 80 + i * 15,
							borderRadius: '50%',
							backgroundColor: COLORS.smoke,
							opacity: 0.4,
							filter: 'blur(20px)',
						}}
					/>
				);
			})}
		</div>
	);
};

export const BurgerExplosion: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// Subtle camera shake after explosion
	const shakeX =
		frame > 25 && frame < 60
			? Math.sin(frame * 2) * interpolate(frame, [25, 60], [6, 0])
			: 0;
	const shakeY =
		frame > 25 && frame < 60
			? Math.cos(frame * 2.5) * interpolate(frame, [25, 60], [4, 0])
			: 0;

	// Zoom in
	const zoom = interpolate(frame, [0, 240], [1, 1.12], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});

	const buildings = [
		{x: -20, width: 160, height: 650, color: '#1e2838'},
		{x: 120, width: 120, height: 500, color: '#2a3545'},
		{x: 230, width: 100, height: 580, color: '#222e3e'},
		{x: 900, width: 140, height: 620, color: '#1e2838'},
		{x: 1020, width: 130, height: 530, color: '#263040'},
		{x: 1130, width: 110, height: 480, color: '#222e3e'},
	];

	const burgers = [
		{x: 400, y: 100, size: 200, rotation: -8, floatPhase: 0},
		{x: 650, y: 60, size: 240, rotation: 12, floatPhase: 2},
		{x: 500, y: 250, size: 180, rotation: -15, floatPhase: 4},
		{x: 750, y: 200, size: 160, rotation: 20, floatPhase: 1},
	];

	const debrisItems = Array.from({length: 20}, (_, i) => ({
		x: 400 + (i * 47) % 500,
		delay: 20 + (i * 3) % 15,
		size: 4 + (i % 6) * 2,
	}));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.sky, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					transform: `translate(${shakeX}px, ${shakeY}px) scale(${zoom})`,
					transformOrigin: '50% 70%',
				}}
			>
				{/* Sky gradient */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: `linear-gradient(180deg, ${COLORS.skyLight} 0%, ${COLORS.sky} 50%, #88aac8 100%)`,
					}}
				/>

				{/* Clouds */}
				{[
					{x: 100, y: 40, w: 250, h: 60},
					{x: 600, y: 80, w: 200, h: 50},
					{x: 950, y: 30, w: 180, h: 45},
				].map((c, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: c.x + frame * 0.1,
							top: c.y,
							width: c.w,
							height: c.h,
							borderRadius: '50%',
							background:
								'radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 70%, transparent 100%)',
						}}
					/>
				))}

				{/* Buildings */}
				{buildings.map((b, i) => (
					<Building key={i} {...b} />
				))}

				{/* Street */}
				<div
					style={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: '15%',
						backgroundColor: COLORS.street,
						boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.4)',
					}}
				>
					{/* Road markings */}
					{Array.from({length: 8}, (_, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								top: '45%',
								left: 50 + i * 170,
								width: 80,
								height: 6,
								backgroundColor: '#eee',
								opacity: 0.7,
								borderRadius: 2,
							}}
						/>
					))}
				</div>

				{/* Explosion on street */}
				<Explosion />

				{/* Debris */}
				{debrisItems.map((d, i) => (
					<Debris key={i} {...d} />
				))}

				{/* Floating burgers */}
				{burgers.map((b, i) => (
					<Burger key={i} {...b} />
				))}
			</div>

			{/* Cinematic bars */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 40,
					backgroundColor: 'black',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: 40,
					backgroundColor: 'black',
				}}
			/>
		</AbsoluteFill>
	);
};
