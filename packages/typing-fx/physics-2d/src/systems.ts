import type { Registry, RenderComponent, System, TransformComponent } from "@typing-fx/core";
import type { ColliderComponent, PhysicsComponent } from "./components";

export interface PhysicsOptions {
	bounceTopDistance?: number;
	bounceBottomDistance?: number;
}

export const createPhysicsSystem = (options: PhysicsOptions = {}): System => {
	return (registry: Registry, dt: number) => {
		const physics = registry.getComponent<PhysicsComponent>("physics");
		const transform = registry.getComponent<TransformComponent>("transform");
		if (!physics || !transform) return;

		const RequiredMask =
			registry.getComponentMask("physics") | registry.getComponentMask("transform");

		for (let i = 0; i < registry.activeCount; i++) {
			if ((registry.entityMasks[i] & RequiredMask) === RequiredMask) {
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
					const topLimit = -Math.abs(options.bounceTopDistance);
					if (transform.y[i] < topLimit) {
						transform.y[i] = topLimit;
						physics.vy[i] *= -0.7;
					}
				}

				if (options.bounceBottomDistance && options.bounceBottomDistance > 0) {
					const bottomLimit = Math.abs(options.bounceBottomDistance);
					if (transform.y[i] > bottomLimit) {
						transform.y[i] = bottomLimit;
						physics.vy[i] *= -0.6;
						physics.vx[i] *= 0.8;
					}
				}

				transform.rotation[i] += physics.vx[i] * physics.rotationFactor[i] * dt;
			}
		}
	};
};

export const createCollisionSystem = (): System => {
	return (registry: Registry, _dt: number): void => {
		const transform = registry.getComponent<TransformComponent>("transform");
		const physics = registry.getComponent<PhysicsComponent>("physics");
		const collider = registry.getComponent<ColliderComponent>("collider");
		const render = registry.getComponent<RenderComponent>("render"); // 任意
		if (!transform || !physics || !collider) return;

		const RequiredMask =
			registry.getComponentMask("transform") |
			registry.getComponentMask("physics") |
			registry.getComponentMask("collider");
		const RenderMask = registry.getComponentMask("render");

		for (let i = 0; i < registry.activeCount; i++) {
			if ((registry.entityMasks[i] & RequiredMask) !== RequiredMask) continue;

			const hasRenderI = render && (registry.entityMasks[i] & RenderMask) === RenderMask;
			const scaleI = hasRenderI ? render.currentScale[i] : 1.0;
			const r1 = collider.radius[i] * scaleI;
			const m1 = collider.mass[i];

			for (let j = i + 1; j < registry.activeCount; j++) {
				if ((registry.entityMasks[j] & RequiredMask) !== RequiredMask) continue;

				const hasRenderJ = render && (registry.entityMasks[j] & RenderMask) === RenderMask;
				const scaleJ = hasRenderJ ? render.currentScale[j] : 1.0;
				const r2 = collider.radius[j] * scaleJ;
				const m2 = collider.mass[j];

				const dx = transform.x[j] - transform.x[i];
				const dy = transform.y[j] - transform.y[i];
				const distSq = dx * dx + dy * dy;
				const minDist = r1 + r2;

				if (distSq < minDist * minDist) {
					const dist = Math.sqrt(distSq);
					if (dist === 0) continue;

					const nx = dx / dist;
					const ny = dy / dist;

					const overlap = minDist - dist;
					const totalMass = m1 + m2;
					const moveRatio1 = m2 / totalMass;
					const moveRatio2 = m1 / totalMass;

					transform.x[i] -= nx * overlap * moveRatio1;
					transform.y[i] -= ny * overlap * moveRatio1;
					transform.x[j] += nx * overlap * moveRatio2;
					transform.y[j] += ny * overlap * moveRatio2;

					const dvx = physics.vx[j] - physics.vx[i];
					const dvy = physics.vy[j] - physics.vy[i];

					const velAlongNormal = dvx * nx + dvy * ny;
					if (velAlongNormal > 0) continue;

					const restitution = Math.min(collider.restitution[i], collider.restitution[j]);
					const jImpulse = (-(1 + restitution) * velAlongNormal) / (1 / m1 + 1 / m2);

					physics.vx[i] -= (jImpulse / m1) * nx;
					physics.vy[i] -= (jImpulse / m1) * ny;
					physics.vx[j] += (jImpulse / m2) * nx;
					physics.vy[j] += (jImpulse / m2) * ny;
				}
			}
		}
	};
};
