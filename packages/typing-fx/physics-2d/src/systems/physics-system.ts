import type { Registry, System, TransformComponent } from "@typing-fx/core";
import { COMPONENT_NAME as COMPONENT_NAME_CORE } from "@typing-fx/core";
import type { ColliderComponent, PhysicsComponent } from "../components";
import { COMPONENT_NAME } from "../constants";

const RAD_TO_DEG = 180 / Math.PI;

export interface PhysicsOptions {
	bounceTopDistance?: number;
	bounceBottomDistance?: number;
	bounceLeftDistance?: number;
	bounceRightDistance?: number;
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

				physics.angularVelocity[i] += physics.torque[i] * dt;
				physics.torque[i] = 0;
				physics.angularVelocity[i] *= physics.angularFriction[i] ** dt;

				transform.x[i] += physics.vx[i] * dt;
				transform.y[i] += physics.vy[i] * dt;

				const wallFriction = 0.85;

				if (options.bounceTopDistance && options.bounceTopDistance > 0) {
					const topLimit = transform.baseY[i] - Math.abs(options.bounceTopDistance);
					if (transform.y[i] < topLimit) {
						transform.y[i] = topLimit;

						physics.angularVelocity[i] *= wallFriction;
						physics.vx[i] *= wallFriction;

						physics.vy[i] *= -0.7;
					}
				}

				if (options.bounceBottomDistance && options.bounceBottomDistance > 0) {
					const bottomLimit = transform.baseY[i] + Math.abs(options.bounceBottomDistance);
					if (transform.y[i] >= bottomLimit) {
						transform.y[i] = bottomLimit;

						physics.angularVelocity[i] *= wallFriction;
						physics.vx[i] *= wallFriction;

						if (Math.abs(physics.vy[i]) < 2.0) {
							physics.vy[i] = 0;
							if (Math.abs(physics.vx[i]) < 0.5) physics.vx[i] = 0;
							if (Math.abs(physics.angularVelocity[i]) < 0.05) physics.angularVelocity[i] = 0;
						} else {
							physics.vy[i] *= -0.6;
						}
					}
				}

				if (options.bounceLeftDistance && options.bounceLeftDistance > 0) {
					const leftLimit = transform.baseX[i] - Math.abs(options.bounceLeftDistance);
					if (transform.x[i] <= leftLimit) {
						transform.x[i] = leftLimit;

						physics.angularVelocity[i] *= wallFriction;
						physics.vy[i] *= wallFriction;

						physics.vx[i] *= -0.7;
					}
				}

				if (options.bounceRightDistance && options.bounceRightDistance > 0) {
					const rightLimit = transform.baseX[i] + Math.abs(options.bounceRightDistance);
					if (transform.x[i] >= rightLimit) {
						transform.x[i] = rightLimit;

						physics.angularVelocity[i] *= wallFriction;
						physics.vy[i] *= wallFriction;

						physics.vx[i] *= -0.7;
					}
				}

				if (Math.abs(physics.vx[i]) < 0.1) physics.vx[i] = 0;
				if (Math.abs(physics.vy[i]) < 0.1) physics.vy[i] = 0;
				if (Math.abs(physics.angularVelocity[i]) < 0.02) physics.angularVelocity[i] = 0;

				transform.rotation[i] += physics.angularVelocity[i] * RAD_TO_DEG * dt;
			}
		}
	};
};
