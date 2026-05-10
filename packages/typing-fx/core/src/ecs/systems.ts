import type { AnimationComponent, LifecycleComponent, RenderComponent } from "./components";
import type { Registry } from "./registry";
import type { System } from "./world";

export const createLifecycleSystem = (): System => {
	return (registry: Registry, dt: number): void => {
		const lifecycle = registry.getComponent<LifecycleComponent>("lifecycle");
		if (!lifecycle) return;

		const RequiredMask = registry.getComponentMask("lifecycle");

		for (let i = registry.activeCount - 1; i >= 0; i--) {
			if ((registry.entityMasks[i] & RequiredMask) !== RequiredMask) continue;

			lifecycle.life[i] -= dt;

			if (lifecycle.life[i] <= 0) {
				const entityId = registry.getEntityIdFromIndex(i);
				registry.destroyEntity(entityId);
			}
		}
	};
};

export const createAnimationSystem = (): System => {
	return (registry: Registry): void => {
		const render = registry.getComponent<RenderComponent>("render");
		const lifecycle = registry.getComponent<LifecycleComponent>("lifecycle");
		const animation = registry.getComponent<AnimationComponent>("animation");
		if (!render || !lifecycle) return;

		const RequiredMask =
			registry.getComponentMask("render") | registry.getComponentMask("lifecycle");
		const AnimMask = registry.getComponentMask("animation");

		for (let i = 0; i < registry.activeCount; i++) {
			if ((registry.entityMasks[i] & RequiredMask) !== RequiredMask) continue;

			const lifeRatio = Math.max(0, lifecycle.life[i] / lifecycle.maxLife[i]);
			const progress = 1.0 - lifeRatio;

			const initScale = render.initialScale[i];
			const targetScale = render.targetScale[i];
			if (initScale !== targetScale) {
				render.currentScale[i] = initScale + (targetScale - initScale) * progress;
			}

			if (animation && (registry.entityMasks[i] & AnimMask) === AnimMask) {
				const frames = animation.frames[i];
				if (frames && frames.length > 0) {
					const frameIndex = Math.min(frames.length - 1, Math.floor(progress * frames.length));
					const currentFrame = frames[frameIndex];
					render.svgUrls[i] = currentFrame.svgUrl;
					render.width[i] = currentFrame.width;
					render.height[i] = currentFrame.height;
				}
			}
		}
	};
};
