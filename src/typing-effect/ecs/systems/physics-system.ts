import { COMPONENT_MASK } from "../constants";
import type { Registry } from "../registry";

interface PhysicsSystem {
	update: (registry: Registry, dt: number, bounceTopDistance: number) => void;
}

export const usePhysicsSystem = (): PhysicsSystem => {
	const RequiredMask = COMPONENT_MASK.transform | COMPONENT_MASK.physics;

	const update = (registry: Registry, dt: number, bounceTopDistance: number): void => {
		const { components, entityMasks, activeCount } = registry;

		for (let i = 0; i < activeCount; i++) {
			if ((entityMasks[i] & RequiredMask) === RequiredMask) {
				components.physics.vy[i] += components.physics.gravity[i] * dt;

				components.physics.vx[i] *= components.physics.friction[i] ** dt;
				components.physics.vy[i] *= components.physics.friction[i] ** dt;

				components.transform.x[i] += components.physics.vx[i] * dt;
				components.transform.y[i] += components.physics.vy[i] * dt;

				if (bounceTopDistance > 0) {
					const topLimit = -Math.abs(bounceTopDistance);
					if (components.transform.y[i] < topLimit) {
						components.transform.y[i] = topLimit;
						components.physics.vy[i] *= -0.7;
					}
				}

				components.transform.rotation[i] +=
					components.physics.vx[i] * components.physics.rotationFactor[i] * dt;
			}
		}
	};

	return { update };
};
