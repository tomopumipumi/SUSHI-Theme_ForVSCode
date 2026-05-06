export const EffectType = {
	maguro: "maguro",
	ikura: "ikura",
	ebi: "ebi",
	matcha: "matcha",
	fever: "fever",
	random: "random",
	none: "none",
} as const;

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

export interface ParticleThemeConfig {
	graphic: GraphicData | GraphicData[];
	count: number;
	vxRange: [number, number];
	vyRange: [number, number];
	gravity: number;
	friction: number;
	rotationFactor: number;
	baseLife: number;
	isTracking?: boolean;
}
