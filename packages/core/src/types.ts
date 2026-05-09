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

export interface Point {
	line: number;
	character: number;
}

export interface CoreSettings {
	bounceTopDistance: number;
	bounceBottomDistance: number;
	particleSpeedMultiplier: number;
	particleLifespanMultiplier: number;
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
