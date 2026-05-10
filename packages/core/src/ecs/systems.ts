import type { CoreSettings } from "../types";
import { COMPONENT_MASK } from "./constants";
import type { Registry } from "./registry";

export const updateLifecycleSystem = (registry: Registry, dt: number): void => {
	const { components, entityMasks, activeCount } = registry;
	const RequiredMask = COMPONENT_MASK.lifecycle;

	for (let i = activeCount - 1; i >= 0; i--) {
		if ((entityMasks[i] & RequiredMask) !== RequiredMask) continue;

		components.lifecycle.life[i] -= dt;

		if (components.lifecycle.life[i] <= 0) {
			const entityId = registry.getEntityIdFromIndex(i);
			registry.destroyEntity(entityId);
		}
	}
};

export const updatePhysicsSystem = (
	registry: Registry,
	dt: number,
	settings: CoreSettings,
): void => {
	const { components, entityMasks, activeCount } = registry;
	const RequiredMask = COMPONENT_MASK.transform | COMPONENT_MASK.physics;

	for (let i = 0; i < activeCount; i++) {
		if ((entityMasks[i] & RequiredMask) === RequiredMask) {
			components.physics.vy[i] += components.physics.gravity[i] * dt;

			components.physics.vx[i] *= components.physics.friction[i] ** dt;
			components.physics.vy[i] *= components.physics.friction[i] ** dt;

			components.transform.x[i] += components.physics.vx[i] * dt;
			components.transform.y[i] += components.physics.vy[i] * dt;

			if (settings.bounceTopDistance > 0) {
				const topLimit = -Math.abs(settings.bounceTopDistance);
				if (components.transform.y[i] < topLimit) {
					components.transform.y[i] = topLimit;
					components.physics.vy[i] *= -0.7;
				}
			}

			if (settings.bounceBottomDistance > 0) {
				const bottomLimit = Math.abs(settings.bounceBottomDistance);
				if (components.transform.y[i] > bottomLimit) {
					components.transform.y[i] = bottomLimit;
					components.physics.vy[i] *= -0.6;
					components.physics.vx[i] *= 0.8;
				}
			}

			components.transform.rotation[i] +=
				components.physics.vx[i] * components.physics.rotationFactor[i] * dt;
		}
	}
};

export const updateCollisionSystem = (registry: Registry): void => {
	const { components, entityMasks, activeCount } = registry;
	const RequiredMask = COMPONENT_MASK.transform | COMPONENT_MASK.physics | COMPONENT_MASK.collider;

	for (let i = 0; i < activeCount; i++) {
		if ((entityMasks[i] & RequiredMask) !== RequiredMask) continue;

		const scaleI = entityMasks[i] & COMPONENT_MASK.render ? components.render.currentScale[i] : 1.0;
		const r1 = components.collider.radius[i] * scaleI;
		const m1 = components.collider.mass[i];

		for (let j = i + 1; j < activeCount; j++) {
			if ((entityMasks[j] & RequiredMask) !== RequiredMask) continue;

			const scaleJ =
				entityMasks[j] & COMPONENT_MASK.render ? components.render.currentScale[j] : 1.0;
			const r2 = components.collider.radius[j] * scaleJ;
			const m2 = components.collider.mass[j];

			const dx = components.transform.x[j] - components.transform.x[i];
			const dy = components.transform.y[j] - components.transform.y[i];
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

				components.transform.x[i] -= nx * overlap * moveRatio1;
				components.transform.y[i] -= ny * overlap * moveRatio1;
				components.transform.x[j] += nx * overlap * moveRatio2;
				components.transform.y[j] += ny * overlap * moveRatio2;

				const dvx = components.physics.vx[j] - components.physics.vx[i];
				const dvy = components.physics.vy[j] - components.physics.vy[i];

				const velAlongNormal = dvx * nx + dvy * ny;
				if (velAlongNormal > 0) continue;

				const restitution = Math.min(
					components.collider.restitution[i],
					components.collider.restitution[j],
				);

				const jImpulse = (-(1 + restitution) * velAlongNormal) / (1 / m1 + 1 / m2);

				components.physics.vx[i] -= (jImpulse / m1) * nx;
				components.physics.vy[i] -= (jImpulse / m1) * ny;
				components.physics.vx[j] += (jImpulse / m2) * nx;
				components.physics.vy[j] += (jImpulse / m2) * ny;
			}
		}
	}
};

export const updateAnimationSystem = (registry: Registry): void => {
	const { components, entityMasks, activeCount } = registry;
	const RequiredMask = COMPONENT_MASK.render | COMPONENT_MASK.lifecycle;

	for (let i = 0; i < activeCount; i++) {
		if ((entityMasks[i] & RequiredMask) !== RequiredMask) continue;

		const lifeRatio = Math.max(0, components.lifecycle.life[i] / components.lifecycle.maxLife[i]);
		const progress = 1.0 - lifeRatio;

		const initScale = components.render.initialScale[i];
		const targetScale = components.render.targetScale[i];
		if (initScale !== targetScale)
			components.render.currentScale[i] = initScale + (targetScale - initScale) * progress;

		if ((entityMasks[i] & COMPONENT_MASK.animation) === COMPONENT_MASK.animation) {
			const frames = components.animation.frames[i];
			if (frames && frames.length > 0) {
				const frameIndex = Math.min(frames.length - 1, Math.floor(progress * frames.length));
				const currentFrame = frames[frameIndex];

				components.render.svgUrls[i] = currentFrame.svgUrl;
				components.render.width[i] = currentFrame.width;
				components.render.height[i] = currentFrame.height;
			}
		}
	}
};

const INVALID_TARGET_ID = -1;
const CAPTURE_DISTANCE = 20;

export const updateTrackingSystem = (
	registry: Registry,
	dt: number,
	onExplode: (
		targetId: string,
		anchorLine: number,
		anchorChar: number,
		x: number,
		y: number,
	) => void,
): void => {
	const { components, entityMasks, activeCount } = registry;
	const RequiredMask =
		COMPONENT_MASK.transform |
		COMPONENT_MASK.physics |
		COMPONENT_MASK.targeting |
		COMPONENT_MASK.render;

	for (let i = activeCount - 1; i >= 0; i--) {
		if ((entityMasks[i] & RequiredMask) !== RequiredMask) continue;

		const targetId = components.targeting.targetEntityId[i];

		if (!registry.isValid(targetId)) {
			components.targeting.targetEntityId[i] = INVALID_TARGET_ID;
			components.physics.gravity[i] = 1.5;
			continue;
		}

		const targetIdx = registry.getComponentIndex(targetId);
		const dx = components.transform.x[targetIdx] - components.transform.x[i];
		const dy = components.transform.y[targetIdx] - components.transform.y[i];
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < CAPTURE_DISTANCE) {
			const tId = components.render.targetIds[i];
			const line = components.render.anchorLine[i];
			const char = components.render.anchorChar[i];

			if (tId) onExplode(tId, line, char, components.transform.x[i], components.transform.y[i]);

			components.lifecycle.life[i] = 0;
			components.lifecycle.life[targetIdx] = 0;
			continue;
		}

		components.physics.vx[i] += (dx / distance) * 5.0 * dt;
		components.physics.vy[i] += (dy / distance) * 5.0 * dt;
		components.physics.gravity[i] = 0;
	}
};
