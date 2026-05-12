import { COMPONENT_NAME as COMPONENT_NAME_CORE } from "@typing-fx/core";
import { COMPONENT_NAME as COMPONENT_NAME_PHYSICS2D } from "@typing-fx/physics-2d";
import { COMPONENT_NAME as COMPONENT_NAME_TRACKING } from "@typing-fx/tracking";
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
	...COMPONENT_NAME_CORE,
	...COMPONENT_NAME_PHYSICS2D,
	...COMPONENT_NAME_TRACKING,
} as const;
export type ComponentNameKey =
	| (typeof COMPONENT_NAME_CORE)[keyof typeof COMPONENT_NAME_CORE]
	| (typeof COMPONENT_NAME_PHYSICS2D)[keyof typeof COMPONENT_NAME_PHYSICS2D]
	| (typeof COMPONENT_NAME_TRACKING)[keyof typeof COMPONENT_NAME_TRACKING];
