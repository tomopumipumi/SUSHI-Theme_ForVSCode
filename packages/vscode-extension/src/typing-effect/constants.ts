import type { EffectTypeKey } from "./types";

export const EffectType = {
	maguro: "maguro",
	ikura: "ikura",
	ebi: "ebi",
	matcha: "matcha",

	fever: "fever",
	random: "random",
	none: "none",
} as const;

export const RANDOM_POOL: EffectTypeKey[] = [
	EffectType.maguro,
	EffectType.ikura,
	EffectType.ebi,
	EffectType.matcha,
] as const;

export const MAX_EFFECT_LEVEL: number = 5;

export const COMPONENT_NAME = {
	transform: "transform",
	lifecycle: "lifecycle",
	render: "render",
	animation: "animation",
	physics: "physics",
	collider: "collider",
	tracking: "tracking",
} as const;
export type ComponentNameKey = (typeof COMPONENT_NAME)[keyof typeof COMPONENT_NAME];
