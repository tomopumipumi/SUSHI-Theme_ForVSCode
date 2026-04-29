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
