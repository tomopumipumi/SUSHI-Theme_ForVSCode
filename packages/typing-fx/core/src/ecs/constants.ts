export const MAX_PARTICLES = 2000;
export const MAX_EFFECT_LEVEL = 5;

export const COMPONENT_NAME = {
	transform: "transform",
	lifecycle: "lifecycle",
	render: "render",
	animation: "animation",
} as const;
export type ComponentNameKey = (typeof COMPONENT_NAME)[keyof typeof COMPONENT_NAME];
