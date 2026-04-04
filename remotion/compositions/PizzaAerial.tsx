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
	sky: '#87CEEB',
	skyTop: '#5da4d6',
	crust: '#d4922a',
	crustDark: '#b07818',
	sauce: '#c62828',
	cheese: '#fdd835',
	cheeseMelt: '#f9a825',
	pepperoni: '#8b1a1a',
	olive: '#2e4a2e',
	herb: '#2e7d32',
	woodBoard: '#8b6914',
	woodDark: '#6b4c0a',
	road: '#555',
	roadLine: '#eee',
	grass: '#4caf50',
	building: '#778899',
	tree: '#2e7d32',
	helicopter: '#444',
};

const PizzaTopping: React.FC<{
	type: 'pepperoni' | 'olive' | 'herb' | 'mushroom';
	x: number;
	y: number;
	size: number;
}> = ({type, x, y, size}) => {
	if (type === 'pepperoni') {
		return (
			<div
				style={{
					position: 'absolute',
					left: x,
					top: y,
					width: size,
					height: size,
					borderRadius: '50%',
					backgroundColor: COLORS.pepperoni,
					boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3)',
				}}
			/>
		);
	}
	if (type === 'olive') {
		return (
			<div
				style={{
					position: 'absolute',
					left: x,
					top: y,
					width: size,
					height: size,
					borderRadius: '50%',
					backgroundColor: COLORS.olive,
					boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.4)',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: '25%',
						left: '25%',
						width: '50%',
						height: '50%',
						borderRadius: '50%',
						backgroundColor: '#4a6a4a',
					}}
				/>
			</div>
		);
	}
	if (type === 'herb') {
		return (
			<div
				style={{
					position: 'absolute',
					left: x,
					top: y,
					width: size * 2,
					height: size,
					backgroundColor: COLORS.herb,
					borderRadius: '40%',
					transform: `rotate(${x * 3}deg)`,
					opacity: 0.8,
				}}
			/>
		);
	}
	// mushroom
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: size,
				height: size * 0.7,
				backgroundColor: '#e8d8b8',
				borderRadius: '50% 50% 10% 10%',
				boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.2)',
			}}
		/>
	);
};

const Helicopter: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
	const orbitAngle = frame * 0.02;
	const hx = 400 + Math.cos(orbitAngle) * 200;
	const hy = 250 + Math.sin(orbitAngle) * 100;
	const bladeRotation = frame * 25;

	return (
		<div
			style={{
				position: 'absolute',
				left: hx,
				top: hy,
				zIndex: 20,
			}}
		>
			{/* Shadow below */}
			<div
				style={{
					position: 'absolute',
					top: 60,
					left: -10,
					width: 70,
					height: 15,
					borderRadius: '50%',
					background: 'rgba(0,0,0,0.15)',
					filter: 'blur(5px)',
				}}
			/>

			{/* Body */}
			<div
				style={{
					width: 50,
					height: 20,
					backgroundColor: COLORS.helicopter,
					borderRadius: '12px 20px 8px 8px',
					position: 'relative',
				}}
			>
				{/* Windshield */}
				<div
					style={{
						position: 'absolute',
						right: -2,
						top: 2,
						width: 16,
						height: 14,
						backgroundColor: 'rgba(100,180,255,0.6)',
						borderRadius: '0 12px 6px 0',
					}}
				/>

				{/* Tail */}
				<div
					style={{
						position: 'absolute',
						left: -35,
						top: 4,
						width: 38,
						height: 6,
						backgroundColor: COLORS.helicopter,
						borderRadius: '4px 0 0 4px',
					}}
				/>
				{/* Tail rotor */}
				<div
					style={{
						position: 'absolute',
						left: -40,
						top: -4,
						width: 4,
						height: 20,
						backgroundColor: '#666',
						borderRadius: 2,
						transform: `rotate(${bladeRotation * 1.2}deg)`,
						transformOrigin: 'center',
					}}
				/>

				{/* Main rotor */}
				<div
					style={{
						position: 'absolute',
						top: -6,
						left: '50%',
						width: 4,
						height: 8,
						backgroundColor: '#555',
						transform: 'translateX(-50%)',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						top: -8,
						left: '50%',
						transform: `translateX(-50%) rotate(${bladeRotation}deg)`,
						transformOrigin: 'center',
					}}
				>
					<div
						style={{
							width: 90,
							height: 4,
							backgroundColor: '#666',
							borderRadius: 2,
							marginLeft: -45,
							opacity: 0.7,
						}}
					/>
				</div>

				{/* Skids */}
				{[-2, 14].map((t, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							bottom: -8,
							left: 5 + i * 20,
							width: 2,
							height: 8,
							backgroundColor: '#555',
						}}
					/>
				))}
				<div
					style={{
						position: 'absolute',
						bottom: -10,
						left: 0,
						width: 45,
						height: 2,
						backgroundColor: '#555',
						borderRadius: 1,
					}}
				/>
			</div>
		</div>
	);
};

export const PizzaAerial: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Camera orbit
	const orbitAngle = frame * 0.008;
	const rotateZ = interpolate(frame, [0, 300], [0, 15], {
		extrapolateRight: 'clamp',
	});
	const zoom = interpolate(frame, [0, 300], [1, 1.08], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});

	// Cloud movement
	const cloudDrift = frame * 0.15;

	// Pizza toppings
	const toppings: Array<{
		type: 'pepperoni' | 'olive' | 'herb' | 'mushroom';
		x: number;
		y: number;
		size: number;
	}> = [
		{type: 'pepperoni', x: 80, y: 90, size: 28},
		{type: 'pepperoni', x: 200, y: 70, size: 25},
		{type: 'pepperoni', x: 300, y: 150, size: 27},
		{type: 'pepperoni', x: 150, y: 250, size: 24},
		{type: 'pepperoni', x: 250, y: 300, size: 26},
		{type: 'pepperoni', x: 350, y: 230, size: 25},
		{type: 'pepperoni', x: 120, y: 170, size: 22},
		{type: 'olive', x: 180, y: 130, size: 18},
		{type: 'olive', x: 280, y: 220, size: 16},
		{type: 'olive', x: 100, y: 300, size: 17},
		{type: 'olive', x: 320, y: 100, size: 15},
		{type: 'herb', x: 140, y: 210, size: 8},
		{type: 'herb', x: 240, y: 160, size: 7},
		{type: 'herb', x: 340, y: 280, size: 9},
		{type: 'herb', x: 90, y: 350, size: 7},
		{type: 'mushroom', x: 210, y: 310, size: 20},
		{type: 'mushroom', x: 310, y: 180, size: 18},
	];

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.skyTop, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					transform: `scale(${zoom}) rotate(${rotateZ}deg)`,
					transformOrigin: '50% 50%',
				}}
			>
				{/* Sky */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: `linear-gradient(180deg, ${COLORS.skyTop} 0%, ${COLORS.sky} 40%, #a8d8ea 100%)`,
					}}
				/>

				{/* City grid below (aerial view) */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0.6,
					}}
				>
					{/* Roads forming roundabout */}
					<svg
						width="100%"
						height="100%"
						viewBox="0 0 1280 720"
						style={{position: 'absolute'}}
					>
						{/* Horizontal road */}
						<rect x="0" y="340" width="1280" height="40" fill={COLORS.road} />
						<line
							x1="0"
							y1="360"
							x2="1280"
							y2="360"
							stroke={COLORS.roadLine}
							strokeWidth="2"
							strokeDasharray="20,15"
						/>
						{/* Vertical road */}
						<rect x="620" y="0" width="40" height="720" fill={COLORS.road} />
						<line
							x1="640"
							y1="0"
							x2="640"
							y2="720"
							stroke={COLORS.roadLine}
							strokeWidth="2"
							strokeDasharray="20,15"
						/>
						{/* Roundabout circle */}
						<circle
							cx="640"
							cy="360"
							r="160"
							fill="none"
							stroke={COLORS.road}
							strokeWidth="35"
						/>
						<circle
							cx="640"
							cy="360"
							r="160"
							fill="none"
							stroke={COLORS.roadLine}
							strokeWidth="1.5"
							strokeDasharray="15,12"
						/>
					</svg>

					{/* Building blocks */}
					{[
						{x: 50, y: 50, w: 120, h: 100},
						{x: 200, y: 40, w: 90, h: 80},
						{x: 320, y: 60, w: 100, h: 110},
						{x: 50, y: 200, w: 140, h: 90},
						{x: 220, y: 180, w: 80, h: 120},
						{x: 800, y: 50, w: 110, h: 100},
						{x: 940, y: 70, w: 130, h: 80},
						{x: 1100, y: 40, w: 100, h: 110},
						{x: 800, y: 200, w: 90, h: 100},
						{x: 940, y: 210, w: 120, h: 70},
						{x: 50, y: 440, w: 100, h: 90},
						{x: 200, y: 460, w: 120, h: 100},
						{x: 800, y: 440, w: 110, h: 90},
						{x: 950, y: 450, w: 100, h: 110},
						{x: 130, y: 580, w: 90, h: 80},
						{x: 900, y: 590, w: 110, h: 80},
					].map((b, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: b.x,
								top: b.y,
								width: b.w,
								height: b.h,
								backgroundColor: COLORS.building,
								boxShadow: '3px 3px 8px rgba(0,0,0,0.3)',
								borderRadius: 2,
							}}
						/>
					))}

					{/* Trees (aerial = circles) */}
					{Array.from({length: 25}, (_, i) => ({
						x: 30 + (i * 197) % 1220,
						y: 20 + (i * 131) % 680,
					}))
						.filter(
							(t) =>
								Math.hypot(t.x - 640, t.y - 360) > 200 &&
								Math.hypot(t.x - 640, t.y - 360) < 500,
						)
						.map((t, i) => (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: t.x,
									top: t.y,
									width: 18,
									height: 18,
									borderRadius: '50%',
									backgroundColor: COLORS.tree,
									boxShadow: '2px 2px 4px rgba(0,0,0,0.2)',
								}}
							/>
						))}
				</div>

				{/* Pizza on wooden board (center of roundabout) */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						transform: 'translate(-50%, -50%)',
						zIndex: 10,
					}}
				>
					{/* Board shadow */}
					<div
						style={{
							position: 'absolute',
							top: 15,
							left: 10,
							width: 440,
							height: 440,
							borderRadius: '50%',
							background: 'rgba(0,0,0,0.25)',
							filter: 'blur(15px)',
						}}
					/>

					{/* Wooden board */}
					<div
						style={{
							width: 440,
							height: 440,
							borderRadius: '50%',
							background: `radial-gradient(circle, ${COLORS.woodBoard} 0%, ${COLORS.woodDark} 100%)`,
							position: 'relative',
							boxShadow:
								'0 8px 30px rgba(0,0,0,0.4), inset 0 0 40px rgba(0,0,0,0.15)',
						}}
					>
						{/* Pizza */}
						<div
							style={{
								position: 'absolute',
								top: 20,
								left: 20,
								width: 400,
								height: 400,
								borderRadius: '50%',
								overflow: 'hidden',
							}}
						>
							{/* Crust ring */}
							<div
								style={{
									width: '100%',
									height: '100%',
									borderRadius: '50%',
									backgroundColor: COLORS.crust,
									position: 'relative',
									boxShadow:
										'inset 0 0 20px rgba(0,0,0,0.2), inset 0 0 60px rgba(180,120,40,0.3)',
								}}
							>
								{/* Sauce layer */}
								<div
									style={{
										position: 'absolute',
										top: 25,
										left: 25,
										right: 25,
										bottom: 25,
										borderRadius: '50%',
										backgroundColor: COLORS.sauce,
									}}
								/>

								{/* Cheese layer */}
								<div
									style={{
										position: 'absolute',
										top: 30,
										left: 30,
										right: 30,
										bottom: 30,
										borderRadius: '50%',
										background: `radial-gradient(circle at 40% 40%, ${COLORS.cheese} 0%, ${COLORS.cheeseMelt} 60%, ${COLORS.cheese} 100%)`,
									}}
								/>

								{/* Toppings */}
								{toppings.map((t, i) => (
									<PizzaTopping key={i} {...t} />
								))}

								{/* Slice lines */}
								<svg
									width="400"
									height="400"
									viewBox="0 0 400 400"
									style={{position: 'absolute', top: 0, left: 0}}
								>
									{[0, 45, 90, 135].map((angle) => (
										<line
											key={angle}
											x1="200"
											y1="200"
											x2={200 + 200 * Math.cos((angle * Math.PI) / 180)}
											y2={200 + 200 * Math.sin((angle * Math.PI) / 180)}
											stroke="rgba(0,0,0,0.1)"
											strokeWidth="1.5"
										/>
									))}
									{[0, 45, 90, 135].map((angle) => (
										<line
											key={`r${angle}`}
											x1="200"
											y1="200"
											x2={200 - 200 * Math.cos((angle * Math.PI) / 180)}
											y2={200 - 200 * Math.sin((angle * Math.PI) / 180)}
											stroke="rgba(0,0,0,0.1)"
											strokeWidth="1.5"
										/>
									))}
								</svg>
							</div>
						</div>
					</div>
				</div>

				{/* Helicopter */}
				<Helicopter frame={frame} fps={fps} />

				{/* Light clouds */}
				{[
					{x: 100, y: 50, w: 200, h: 40},
					{x: 800, y: 100, w: 150, h: 35},
					{x: 1050, y: 60, w: 180, h: 38},
				].map((c, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: c.x + cloudDrift,
							top: c.y,
							width: c.w,
							height: c.h,
							borderRadius: '50%',
							background:
								'radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 70%, transparent 100%)',
							zIndex: 25,
						}}
					/>
				))}
			</div>

			{/* Warm sunlight overlay */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						'radial-gradient(ellipse at 30% 20%, rgba(255,200,100,0.1) 0%, transparent 60%)',
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};
