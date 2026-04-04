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
	bg: '#0a0408',
	fry: '#e8b830',
	fryDark: '#c49020',
	containerRed: '#8b1a1a',
	containerDark: '#5c0e0e',
	eyeGlow: '#ff2020',
	lightning: '#c8d8ff',
	ember: '#ff6820',
	ketchup: '#cc1010',
	smoke: 'rgba(60,50,50,0.4)',
	ground: '#1a1210',
};

const Ember: React.FC<{
	x: number;
	y: number;
	size: number;
	delay: number;
	speed: number;
}> = ({x, y, size, delay, speed}) => {
	const frame = useCurrentFrame();
	const t = Math.max(0, frame - delay);
	const yOffset = t * speed * -1;
	const xDrift = Math.sin(t * 0.08 + x) * 15;
	const opacity = interpolate(t, [0, 20, 60], [0, 1, 0], {
		extrapolateRight: 'clamp',
	});
	const glow = size * 3;

	return (
		<div
			style={{
				position: 'absolute',
				left: x + xDrift,
				top: y + yOffset,
				width: size,
				height: size,
				borderRadius: '50%',
				backgroundColor: COLORS.ember,
				opacity,
				boxShadow: `0 0 ${glow}px ${glow / 2}px ${COLORS.ember}`,
			}}
		/>
	);
};

const Lightning: React.FC<{frame: number}> = ({frame}) => {
	const flash1 = frame >= 45 && frame <= 48;
	const flash2 = frame >= 110 && frame <= 113;
	const flash3 = frame >= 200 && frame <= 202;
	const active = flash1 || flash2 || flash3;

	if (!active) return null;

	return (
		<>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						'radial-gradient(ellipse at 60% 10%, rgba(200,216,255,0.3) 0%, transparent 60%)',
					zIndex: 5,
				}}
			/>
			<svg
				style={{position: 'absolute', top: 0, left: '55%', zIndex: 6}}
				width="120"
				height="400"
				viewBox="0 0 120 400"
			>
				<polyline
					points="60,0 45,100 75,110 30,250 65,255 20,400"
					fill="none"
					stroke={COLORS.lightning}
					strokeWidth="4"
					opacity="0.9"
				/>
				<polyline
					points="60,0 45,100 75,110 30,250 65,255 20,400"
					fill="none"
					stroke="white"
					strokeWidth="2"
					opacity="0.6"
				/>
			</svg>
		</>
	);
};

const FryHair: React.FC<{x: number; height: number; delay: number}> = ({
	x,
	height,
	delay,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const grow = spring({frame: frame - delay, fps, config: {damping: 20}});
	const sway = Math.sin(frame * 0.06 + x * 0.1) * 3;

	return (
		<div
			style={{
				position: 'absolute',
				bottom: '100%',
				left: x,
				width: 14,
				height: height * grow,
				backgroundColor: COLORS.fry,
				borderRadius: '4px 4px 2px 2px',
				transform: `rotate(${sway}deg)`,
				transformOrigin: 'bottom center',
				boxShadow: `inset -3px 0 0 ${COLORS.fryDark}`,
			}}
		/>
	);
};

const MonsterTeeth: React.FC = () => {
	const teeth = Array.from({length: 8}, (_, i) => i);
	return (
		<div
			style={{
				position: 'absolute',
				top: -2,
				left: 10,
				right: 10,
				display: 'flex',
				justifyContent: 'space-around',
			}}
		>
			{teeth.map((i) => (
				<div
					key={i}
					style={{
						width: 12,
						height: i % 2 === 0 ? 18 : 12,
						backgroundColor: '#f0f0e0',
						clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
					}}
				/>
			))}
		</div>
	);
};

const GlowingEye: React.FC<{x: number}> = ({x}) => {
	const frame = useCurrentFrame();
	const pulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.7, 1]);

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: 30,
				width: 28,
				height: 28,
				borderRadius: '50%',
				backgroundColor: COLORS.eyeGlow,
				opacity: pulse,
				boxShadow: `0 0 20px 10px ${COLORS.eyeGlow}, 0 0 40px 20px rgba(255,32,32,0.4)`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 8,
					left: 8,
					width: 12,
					height: 12,
					borderRadius: '50%',
					backgroundColor: '#220000',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 10,
					left: 14,
					width: 4,
					height: 4,
					borderRadius: '50%',
					backgroundColor: '#ff8080',
				}}
			/>
		</div>
	);
};

const KetchupBottle: React.FC<{frame: number}> = ({frame}) => {
	const swing = Math.sin(frame * 0.04) * 5;
	const dripHeight = interpolate(frame % 80, [0, 40, 60, 80], [0, 15, 15, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				right: -60,
				top: 20,
				transform: `rotate(${-15 + swing}deg)`,
				transformOrigin: 'top left',
			}}
		>
			{/* Bottle body */}
			<div
				style={{
					width: 30,
					height: 80,
					backgroundColor: COLORS.ketchup,
					borderRadius: '6px 6px 12px 12px',
					position: 'relative',
				}}
			>
				{/* Cap */}
				<div
					style={{
						position: 'absolute',
						top: -16,
						left: 8,
						width: 14,
						height: 20,
						backgroundColor: '#ddd',
						borderRadius: '3px 3px 0 0',
					}}
				/>
				{/* Label */}
				<div
					style={{
						position: 'absolute',
						top: 20,
						left: 4,
						right: 4,
						height: 30,
						backgroundColor: '#f5f0e0',
						borderRadius: 3,
					}}
				/>
				{/* Drip */}
				<div
					style={{
						position: 'absolute',
						bottom: -dripHeight,
						left: 12,
						width: 6,
						height: dripHeight,
						backgroundColor: COLORS.ketchup,
						borderRadius: '0 0 3px 3px',
					}}
				/>
			</div>
		</div>
	);
};

export const FriesMonster: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Camera push-in
	const zoom = interpolate(frame, [0, 240], [1, 1.15], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});

	// Character walk bob
	const walkBob = Math.sin(frame * 0.12) * 4;
	const walkX = interpolate(frame, [0, 240], [-80, 40], {
		extrapolateRight: 'clamp',
	});

	// Fade in
	const fadeIn = interpolate(frame, [0, 30], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Generate embers
	const embers = Array.from({length: 40}, (_, i) => ({
		x: 100 + (i * 237) % 1080,
		y: 600 + (i * 131) % 200,
		size: 2 + (i % 4),
		delay: (i * 7) % 60,
		speed: 0.8 + (i % 3) * 0.4,
	}));

	// Fry hair positions
	const fries = Array.from({length: 12}, (_, i) => ({
		x: 10 + i * 14,
		height: 60 + Math.sin(i * 1.5) * 30,
		delay: i * 3,
	}));

	return (
		<AbsoluteFill
			style={{
				backgroundColor: COLORS.bg,
				overflow: 'hidden',
				opacity: fadeIn,
			}}
		>
			{/* Stormy sky gradient */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: '60%',
					background:
						'linear-gradient(180deg, #0c0610 0%, #1a0820 30%, #2a1020 50%, #401818 70%, #200c08 100%)',
				}}
			/>

			{/* Fiery horizon */}
			<div
				style={{
					position: 'absolute',
					bottom: '20%',
					left: 0,
					right: 0,
					height: '25%',
					background:
						'linear-gradient(180deg, transparent 0%, rgba(180,60,10,0.3) 40%, rgba(220,80,10,0.5) 70%, rgba(160,40,5,0.4) 100%)',
				}}
			/>

			{/* Ground */}
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: '22%',
					background: `linear-gradient(180deg, ${COLORS.ground} 0%, #0a0806 100%)`,
				}}
			/>

			<Lightning frame={frame} />

			{/* Scene container with zoom */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					transform: `scale(${zoom})`,
					transformOrigin: '50% 60%',
				}}
			>
				{/* Embers */}
				{embers.map((e, i) => (
					<Ember key={i} {...e} />
				))}

				{/* Smoke layers */}
				{[0, 1, 2].map((i) => {
					const smokeX = interpolate(
						frame,
						[0, 240],
						[-200 + i * 100, -100 + i * 100],
					);
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								bottom: '15%',
								left: smokeX,
								width: 600,
								height: 200,
								borderRadius: '50%',
								background: COLORS.smoke,
								filter: 'blur(40px)',
								opacity: 0.4 + i * 0.1,
							}}
						/>
					);
				})}

				{/* CHARACTER */}
				<div
					style={{
						position: 'absolute',
						left: `calc(50% + ${walkX}px)`,
						bottom: `calc(18% + ${walkBob}px)`,
						transform: 'translateX(-50%)',
					}}
				>
					{/* Container body */}
					<div
						style={{
							width: 190,
							height: 160,
							position: 'relative',
							background: `linear-gradient(180deg, ${COLORS.containerRed} 0%, ${COLORS.containerDark} 100%)`,
							borderRadius: '8px 8px 20px 20px',
							clipPath:
								'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
							boxShadow: `0 0 30px rgba(255,32,32,0.2), inset 0 -20px 30px rgba(0,0,0,0.4)`,
						}}
					>
						{/* Fry hair */}
						{fries.map((f, i) => (
							<FryHair key={i} {...f} />
						))}

						{/* Monster teeth */}
						<MonsterTeeth />

						{/* Eyes */}
						<GlowingEye x={40} />
						<GlowingEye x={110} />

						{/* Container stripes */}
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								style={{
									position: 'absolute',
									top: 75 + i * 20,
									left: 15,
									right: 15,
									height: 3,
									backgroundColor: 'rgba(255,255,255,0.08)',
									borderRadius: 2,
								}}
							/>
						))}

						{/* Ketchup bottle held on right side */}
						<KetchupBottle frame={frame} />
					</div>

					{/* Legs */}
					{[-25, 25].map((offset, i) => {
						const legAnim =
							Math.sin(frame * 0.12 + i * Math.PI) * 8;
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									bottom: -40,
									left: `calc(50% + ${offset}px)`,
									width: 18,
									height: 40,
									backgroundColor: COLORS.containerDark,
									borderRadius: '0 0 6px 6px',
									transform: `rotate(${legAnim}deg)`,
									transformOrigin: 'top center',
								}}
							/>
						);
					})}

					{/* Character ground shadow */}
					<div
						style={{
							position: 'absolute',
							bottom: -50,
							left: '50%',
							transform: 'translateX(-50%)',
							width: 200,
							height: 20,
							borderRadius: '50%',
							background:
								'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)',
						}}
					/>
				</div>
			</div>

			{/* Vignette */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Film grain overlay */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.04,
					background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};
