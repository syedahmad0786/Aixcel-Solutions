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
	bg: '#0a0404',
	lavaRed: '#ff3300',
	lavaOrange: '#ff8800',
	lavaYellow: '#ffcc00',
	lavaDark: '#cc2200',
	magma: '#ff4400',
	rock: '#1a1210',
	rockLight: '#2a2018',
	bunTop: '#c48820',
	bunDark: '#a06810',
	sesame: '#f0e0c0',
	cheese: '#ff9900',
	cheeseMelt: '#ffaa00',
	patty: '#3a1a0c',
	smokeLight: 'rgba(80,60,40,0.3)',
	smokeDark: 'rgba(40,30,20,0.4)',
	glow: 'rgba(255,100,0,0.15)',
};

const LavaRiver: React.FC<{
	y: number;
	width: number;
	offset: number;
}> = ({y, width, offset}) => {
	const frame = useCurrentFrame();
	const flow = frame * 0.3 + offset;
	const waveY = Math.sin(flow * 0.05) * 3;

	return (
		<div
			style={{
				position: 'absolute',
				top: y + waveY,
				left: offset,
				width,
				height: 12,
				borderRadius: 6,
				background: `linear-gradient(90deg, ${COLORS.lavaDark}, ${COLORS.lavaOrange}, ${COLORS.lavaYellow}, ${COLORS.lavaOrange}, ${COLORS.lavaDark})`,
				backgroundSize: '200% 100%',
				backgroundPosition: `${flow % 200}% 0`,
				boxShadow: `0 0 15px ${COLORS.lavaRed}, 0 0 30px rgba(255,68,0,0.4)`,
			}}
		/>
	);
};

const LavaCrack: React.FC<{
	x: number;
	y: number;
	length: number;
	angle: number;
}> = ({x, y, length, angle}) => {
	const frame = useCurrentFrame();
	const pulse = interpolate(
		Math.sin(frame * 0.08 + x * 0.1),
		[-1, 1],
		[0.5, 1],
	);

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: length,
				height: 3,
				background: `linear-gradient(90deg, transparent, ${COLORS.lavaOrange}, ${COLORS.lavaYellow}, ${COLORS.lavaOrange}, transparent)`,
				transform: `rotate(${angle}deg)`,
				opacity: pulse,
				boxShadow: `0 0 8px ${COLORS.lavaRed}`,
				borderRadius: 2,
			}}
		/>
	);
};

const SmokeColumn: React.FC<{x: number; delay: number; side: 'left' | 'right'}> = ({
	x,
	delay,
	side,
}) => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - delay);
	const cycle = t % 100;
	const yOffset = -cycle * 2;
	const drift = side === 'left' ? -cycle * 0.3 : cycle * 0.3;
	const scale = interpolate(cycle, [0, 100], [0.8, 2.5]);
	const opacity = interpolate(cycle, [0, 20, 80, 100], [0, 0.25, 0.1, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: x + drift,
				top: 300 + yOffset,
				width: 80,
				height: 60,
				borderRadius: '50%',
				backgroundColor: COLORS.smokeDark,
				transform: `scale(${scale})`,
				opacity,
				filter: 'blur(15px)',
			}}
		/>
	);
};

const GlowingCoal: React.FC<{x: number; y: number; size: number}> = ({
	x,
	y,
	size,
}) => {
	const frame = useCurrentFrame();
	const pulse = interpolate(
		Math.sin(frame * 0.1 + x * 0.2),
		[-1, 1],
		[0.4, 1],
	);

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: size,
				height: size * 0.6,
				borderRadius: '40%',
				backgroundColor: COLORS.rock,
				boxShadow: `
          inset 0 0 ${size * 0.4}px ${COLORS.lavaRed},
          0 0 ${size * 0.6}px rgba(255,68,0,${0.3 * pulse})
        `,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: '30%',
					left: '20%',
					width: '60%',
					height: '40%',
					borderRadius: '50%',
					background: `radial-gradient(circle, ${COLORS.lavaOrange} 0%, transparent 70%)`,
					opacity: pulse,
				}}
			/>
		</div>
	);
};

export const VolcanicBurger: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Slow cinematic zoom
	const zoom = interpolate(frame, [0, 300], [1, 1.18], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});

	// Cheese/lava melt animation
	const meltProgress = interpolate(frame, [20, 200], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});

	// Heat distortion
	const heatWave = Math.sin(frame * 0.08) * 1;

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
					transformOrigin: '50% 45%',
				}}
			>
				{/* Dark volcanic sky */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '55%',
						background:
							'linear-gradient(180deg, #060204 0%, #120608 30%, #1a0a06 50%, #2a1008 70%, #1a0804 100%)',
					}}
				/>

				{/* Lava glow on horizon */}
				<div
					style={{
						position: 'absolute',
						top: '40%',
						left: 0,
						right: 0,
						height: '20%',
						background: `linear-gradient(180deg, transparent, rgba(255,68,0,0.15), rgba(255,100,0,0.2), rgba(200,40,0,0.1), transparent)`,
					}}
				/>

				{/* Rocky terrain */}
				<div
					style={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: '45%',
						backgroundColor: COLORS.rock,
						background: `linear-gradient(180deg, ${COLORS.rockLight} 0%, ${COLORS.rock} 40%, #0c0806 100%)`,
					}}
				/>

				{/* Lava cracks on ground */}
				{[
					{x: 100, y: 480, length: 80, angle: 15},
					{x: 300, y: 520, length: 60, angle: -20},
					{x: 500, y: 500, length: 100, angle: 5},
					{x: 700, y: 530, length: 70, angle: -10},
					{x: 900, y: 490, length: 90, angle: 25},
					{x: 1100, y: 510, length: 65, angle: -15},
					{x: 200, y: 560, length: 55, angle: 30},
					{x: 600, y: 570, length: 75, angle: -5},
					{x: 850, y: 560, length: 50, angle: 20},
					{x: 1050, y: 550, length: 80, angle: -25},
				].map((crack, i) => (
					<LavaCrack key={i} {...crack} />
				))}

				{/* Lava rivers */}
				<LavaRiver y={540} width={200} offset={50} />
				<LavaRiver y={580} width={150} offset={400} />
				<LavaRiver y={560} width={180} offset={800} />
				<LavaRiver y={600} width={220} offset={200} />

				{/* Glowing coals */}
				{[
					{x: 450, y: 520, size: 30},
					{x: 550, y: 540, size: 25},
					{x: 680, y: 510, size: 28},
					{x: 780, y: 545, size: 22},
				].map((coal, i) => (
					<GlowingCoal key={i} {...coal} />
				))}

				{/* Smoke columns */}
				{[
					{x: 300, delay: 0, side: 'left' as const},
					{x: 500, delay: 20, side: 'right' as const},
					{x: 700, delay: 10, side: 'left' as const},
					{x: 900, delay: 30, side: 'right' as const},
					{x: 600, delay: 5, side: 'left' as const},
				].map((s, i) => (
					<SmokeColumn key={i} {...s} />
				))}

				{/* BURGER */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '38%',
						transform: `translate(-50%, -50%)`,
						width: 340,
						height: 260,
					}}
				>
					{/* Burger glow underneath */}
					<div
						style={{
							position: 'absolute',
							bottom: -30,
							left: '50%',
							transform: 'translateX(-50%)',
							width: 300,
							height: 60,
							borderRadius: '50%',
							background: `radial-gradient(ellipse, ${COLORS.lavaOrange} 0%, ${COLORS.lavaRed} 40%, transparent 70%)`,
							opacity: 0.5,
							filter: 'blur(10px)',
						}}
					/>

					{/* Top bun */}
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: '5%',
							width: '90%',
							height: 80,
							backgroundColor: COLORS.bunTop,
							borderRadius: '50% 50% 8px 8px',
							boxShadow: `
                inset 0 -8px 15px rgba(0,0,0,0.3),
                0 0 20px rgba(255,100,0,0.2)
              `,
						}}
					>
						{/* Sesame seeds */}
						{[
							{x: 30, y: 12},
							{x: 80, y: 8},
							{x: 140, y: 14},
							{x: 200, y: 10},
							{x: 250, y: 16},
							{x: 60, y: 28},
							{x: 120, y: 24},
							{x: 180, y: 30},
							{x: 230, y: 22},
						].map((s, i) => (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: s.x,
									top: s.y,
									width: 6,
									height: 10,
									backgroundColor: COLORS.sesame,
									borderRadius: '40%',
									transform: `rotate(${s.x * 2}deg)`,
								}}
							/>
						))}
					</div>

					{/* Double patty 1 */}
					<div
						style={{
							position: 'absolute',
							top: 78,
							left: '8%',
							width: '84%',
							height: 35,
							backgroundColor: COLORS.patty,
							borderRadius: 6,
							boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.4)',
						}}
					/>

					{/* LAVA CHEESE (melting like lava) */}
					<div
						style={{
							position: 'relative',
							top: 110,
							left: '3%',
							width: '94%',
							height: 30,
						}}
					>
						{/* Cheese body */}
						<div
							style={{
								width: '100%',
								height: '100%',
								background: `linear-gradient(180deg, ${COLORS.cheeseMelt} 0%, ${COLORS.cheese} 50%, ${COLORS.lavaOrange} 100%)`,
								borderRadius: 4,
								boxShadow: `0 0 20px ${COLORS.lavaOrange}, 0 0 40px rgba(255,68,0,0.3)`,
							}}
						/>

						{/* Cheese drips (lava-like) */}
						{[
							{x: '10%', h: 30 + meltProgress * 40},
							{x: '25%', h: 20 + meltProgress * 55},
							{x: '42%', h: 35 + meltProgress * 45},
							{x: '58%', h: 25 + meltProgress * 50},
							{x: '72%', h: 30 + meltProgress * 35},
							{x: '88%', h: 15 + meltProgress * 45},
						].map((drip, i) => (
							<div
								key={i}
								style={{
									position: 'absolute',
									top: 25,
									left: drip.x,
									width: 14,
									height: drip.h,
									background: `linear-gradient(180deg, ${COLORS.cheeseMelt}, ${COLORS.lavaOrange}, ${COLORS.lavaRed})`,
									borderRadius: '0 0 7px 7px',
									boxShadow: `0 0 10px ${COLORS.lavaRed}, 0 ${drip.h * 0.3}px 15px rgba(255,68,0,0.3)`,
								}}
							>
								{/* Drip glow tip */}
								<div
									style={{
										position: 'absolute',
										bottom: 0,
										left: '50%',
										transform: 'translateX(-50%)',
										width: 8,
										height: 8,
										borderRadius: '50%',
										backgroundColor: COLORS.lavaYellow,
										boxShadow: `0 0 8px ${COLORS.lavaOrange}`,
									}}
								/>
							</div>
						))}
					</div>

					{/* Double patty 2 */}
					<div
						style={{
							position: 'absolute',
							top: 145,
							left: '8%',
							width: '84%',
							height: 35,
							backgroundColor: COLORS.patty,
							borderRadius: 6,
							boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.4)',
						}}
					/>

					{/* Bottom bun */}
					<div
						style={{
							position: 'absolute',
							bottom: 20,
							left: '8%',
							width: '84%',
							height: 50,
							backgroundColor: COLORS.bunDark,
							borderRadius: '6px 6px 45% 45%',
							boxShadow:
								'inset 0 -5px 10px rgba(0,0,0,0.3), 0 0 15px rgba(255,68,0,0.15)',
						}}
					/>
				</div>

				{/* Orange/red reflections on burger */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '38%',
						transform: 'translate(-50%, -50%)',
						width: 340,
						height: 260,
						background:
							'radial-gradient(ellipse at 50% 80%, rgba(255,100,0,0.1) 0%, transparent 60%)',
						pointerEvents: 'none',
					}}
				/>
			</div>

			{/* Volumetric smoke overlay */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						'linear-gradient(180deg, rgba(20,10,5,0.4) 0%, transparent 30%, transparent 70%, rgba(20,10,5,0.3) 100%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Vignette */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)',
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};
