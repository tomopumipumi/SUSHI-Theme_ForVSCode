import { COMPONENT_MASK } from "../constants";
import type { Registry } from "../registry";

export const useAnimationSystem = () => {
	const RequiredMask = COMPONENT_MASK.render | COMPONENT_MASK.lifecycle | COMPONENT_MASK.animation;

	const update = (registry: Registry) => {
		const { components, entityMasks, activeCount } = registry;
		const { render, lifecycle, animation } = components;

		for (let i = 0; i < activeCount; i++) {
			if ((entityMasks[i] & RequiredMask) !== RequiredMask) continue;

			const frames = animation.frames[i];
			if (!frames || frames.length === 0) continue;

			const lifeRatio = Math.max(0, lifecycle.life[i] / lifecycle.maxLife[i]);

			const progress = 1.0 - lifeRatio;

			const frameIndex = Math.min(frames.length - 1, Math.floor(progress * frames.length));

			const currentFrame = frames[frameIndex];

			render.svgUrls[i] = currentFrame.svgUrl;
			render.width[i] = currentFrame.width;
			render.height[i] = currentFrame.height;
		}
	};

	return { update };
};
