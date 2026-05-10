export const MAX_PARTICLES = 2000;
export const MAX_EFFECT_LEVEL = 5;

export const COMPONENT_MASK = {
	none: 0,
	transform: 1 << 0,
	physics: 1 << 1,
	render: 1 << 2,
	lifecycle: 1 << 3,
	targeting: 1 << 4,
	animation: 1 << 5,
	collider: 1 << 6,
} as const;

export const DEFAULT_PARTICLE_MASK =
	COMPONENT_MASK.transform |
	COMPONENT_MASK.physics |
	COMPONENT_MASK.render |
	COMPONENT_MASK.lifecycle;
