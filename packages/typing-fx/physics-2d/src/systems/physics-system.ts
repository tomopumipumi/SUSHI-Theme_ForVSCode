import type { Registry, System, TransformComponent } from "@typing-fx/core";
import { COMPONENT_NAME as COMPONENT_NAME_CORE } from "@typing-fx/core";
import type { ColliderComponent, PhysicsComponent } from "../components";
import { COMPONENT_NAME } from "../constants";

export interface PhysicsOptions {
	bounceTopDistance?: number;
	bounceBottomDistance?: number;
}

export const usePhysicsSystem = (options: PhysicsOptions = {}): System => {
	return (registry: Registry, dt: number) => {
		const physics = registry.getComponent<PhysicsComponent>(COMPONENT_NAME.physics);
		const transform = registry.getComponent<TransformComponent>(COMPONENT_NAME_CORE.transform);
		if (!physics || !transform) return;

		const collider = registry.getComponent<ColliderComponent>(COMPONENT_NAME.collider);

		const RequiredMask =
			registry.getComponentMask(COMPONENT_NAME.physics) |
			registry.getComponentMask(COMPONENT_NAME_CORE.transform);

		for (let i = 0; i < registry.activeCount; i++) {
			if ((registry.entityMasks[i] & RequiredMask) === RequiredMask) {
				if (collider && collider.isStatic[i] === 1) continue;

				const activeGravity = physics.ignoreGravity[i] ? 0 : physics.gravity[i];

				physics.vx[i] += physics.fx[i] * dt;
				physics.vy[i] += (physics.fy[i] + activeGravity) * dt;

				physics.fx[i] = 0;
				physics.fy[i] = 0;

				physics.vx[i] *= physics.friction[i] ** dt;
				physics.vy[i] *= physics.friction[i] ** dt;

				transform.x[i] += physics.vx[i] * dt;
				transform.y[i] += physics.vy[i] * dt;

				if (options.bounceTopDistance && options.bounceTopDistance > 0) {
					const topLimit = transform.baseY[i] - Math.abs(options.bounceTopDistance);
					if (transform.y[i] < topLimit) {
						transform.y[i] = topLimit;
						physics.vy[i] *= -0.7;
					}
				}

				if (options.bounceBottomDistance && options.bounceBottomDistance > 0) {
					const bottomLimit = transform.baseY[i] + Math.abs(options.bounceBottomDistance);
					if (transform.y[i] >= bottomLimit) {
						transform.y[i] = bottomLimit;

						if (Math.abs(physics.vy[i]) < 2.0) {
							physics.vy[i] = 0;
						} else {
							physics.vy[i] *= -0.6;
						}
						physics.vx[i] *= 0.7;
					}
				}

				transform.rotation[i] += physics.vx[i] * physics.rotationFactor[i] * dt;
			}
		}
	};
};
