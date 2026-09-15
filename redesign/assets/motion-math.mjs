// Shared by the scroll controller and the 3D scene; independent of frame rate.
export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
export const mix = (a, b, t) => a + (b - a) * t;
export const smooth = t => {t = clamp(t); return t * t * (3 - 2 * t);};
export const scrollProgress = (top, height, viewport) => clamp(-top / Math.max(1, height - viewport));
export const phaseAt = value => Math.min(2, Math.floor(clamp(value) * 3));
export const damp = (current, target, seconds) => mix(current, target, 1 - Math.exp(-9 * clamp(seconds, 0, .1)));
