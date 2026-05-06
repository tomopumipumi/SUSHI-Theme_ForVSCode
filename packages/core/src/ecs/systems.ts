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

export const updateAnimationSystem = (registry: Registry): void => {
	const { components, entityMasks, activeCount } = registry;
	const RequiredMask = COMPONENT_MASK.render | COMPONENT_MASK.lifecycle | COMPONENT_MASK.animation;

	for (let i = 0; i < activeCount; i++) {
		if ((entityMasks[i] & RequiredMask) !== RequiredMask) continue;

		const frames = components.animation.frames[i];
		if (!frames || frames.length === 0) continue;

		const lifeRatio = Math.max(0, components.lifecycle.life[i] / components.lifecycle.maxLife[i]);
		const progress = 1.0 - lifeRatio;
		const frameIndex = Math.min(frames.length - 1, Math.floor(progress * frames.length));
		const currentFrame = frames[frameIndex];

		components.render.svgUrls[i] = currentFrame.svgUrl;
		components.render.width[i] = currentFrame.width;
		components.render.height[i] = currentFrame.height;
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
			components.physics.gravity[i] = 1.5; // Target lost
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
