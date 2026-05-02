import { COMPONENT_MASK } from "../constants";
import type { Registry } from "../registry";

interface LifecycleSystem {
	update: (registry: Registry, dt: number) => void;
}

export const useLifecycleSystem = (): LifecycleSystem => {
	const RequiredMask = COMPONENT_MASK.lifecycle;

	const update = (registry: Registry, dt: number): void => {
		const { components, entityMasks, activeCount } = registry;

		for (let i = activeCount - 1; i >= 0; i--) {
			if ((entityMasks[i] & RequiredMask) !== RequiredMask) continue;

			components.lifecycle.life[i] -= dt;

			if (components.lifecycle.life[i] <= 0) registry.destroyEntity(i);
		}
	};

	return { update };
};
