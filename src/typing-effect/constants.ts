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
