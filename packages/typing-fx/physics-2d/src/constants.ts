export const COMPONENT_NAME = {
	physics: "physics",
	collider: "collider",
} as const;
export type ComponentNameKey = (typeof COMPONENT_NAME)[keyof typeof COMPONENT_NAME];
