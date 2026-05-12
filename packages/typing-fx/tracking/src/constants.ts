export const COMPONENT_NAME = {
	tracking: "tracking",
} as const;
export type ComponentNameKey = (typeof COMPONENT_NAME)[keyof typeof COMPONENT_NAME];
