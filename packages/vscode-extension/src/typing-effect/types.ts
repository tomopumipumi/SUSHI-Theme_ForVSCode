import type { EffectType } from "./constants";

export type EffectTypeKey = (typeof EffectType)[keyof typeof EffectType];

export interface GraphicLevel {
	width: number;
	height: number;
	svgContent: string;
}

export interface GraphicData {
	width: number;
	height: number;
	svgUrl: string;
}

export interface ParticleProfile {
	graphic: GraphicData | GraphicData[];
	count: number;
	vxRange: [number, number];
	vyRange: [number, number];
	gravity: number;
	friction: number;
	rotationFactor: number;
	baseLife: number;
	isTracking?: boolean;
	isAnimation?: boolean;
	spawnSpreadX?: [number, number];
	spawnSpreadY?: [number, number];
	initialRotationRange?: [number, number];
	initialScaleRange?: [number, number];
	targetScale?: number;
}
