import type { CoreSettings, ParticleProfile } from "../types";
import { COMPONENT_MASK, DEFAULT_PARTICLE_MASK } from "./constants";
import type { Registry } from "./registry";

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

export const spawnGenericParticles = (
	registry: Registry,
	settings: CoreSettings,
	profile: ParticleProfile,
	targetId: string,
	anchorLine: number,
	anchorChar: number,
	targetEntityId?: number,
): void => {
	const { render, transform, physics, lifecycle, targeting, animation } = registry.components;

	let mask = DEFAULT_PARTICLE_MASK;
	if (profile.isTracking) mask |= COMPONENT_MASK.targeting;

	if (profile.isAnimation && Array.isArray(profile.graphic)) mask |= COMPONENT_MASK.animation;

	for (let i = 0; i < profile.count; i++) {
		const entityId = registry.createEntity(mask);
		if (entityId === -1) return;

		const dataIdx = registry.getComponentIndex(entityId);
		if (dataIdx === -1) continue;

		let initialSvgUrl = "";
		let initialWidth = 0;
		let initialHeight = 0;

		if (profile.isAnimation && Array.isArray(profile.graphic)) {
			animation.frames[dataIdx] = profile.graphic;
			initialSvgUrl = profile.graphic[0].svgUrl;
			initialWidth = profile.graphic[0].width;
			initialHeight = profile.graphic[0].height;
		} else {
			const graphic = Array.isArray(profile.graphic)
				? profile.graphic[Math.floor(Math.random() * profile.graphic.length)]
				: profile.graphic;
			initialSvgUrl = graphic.svgUrl;
			initialWidth = graphic.width;
			initialHeight = graphic.height;
		}
		render.targetIds[dataIdx] = targetId;
		render.anchorLine[dataIdx] = anchorLine;
		render.anchorChar[dataIdx] = anchorChar;
		render.svgUrls[dataIdx] = initialSvgUrl;
		render.width[dataIdx] = initialWidth;
		render.height[dataIdx] = initialHeight;

		transform.x[dataIdx] = profile.spawnSpreadX
			? randomInRange(profile.spawnSpreadX[0], profile.spawnSpreadX[1])
			: 0;
		transform.y[dataIdx] = profile.spawnSpreadY
			? randomInRange(profile.spawnSpreadY[0], profile.spawnSpreadY[1])
			: 0;
		transform.rotation[dataIdx] = profile.initialRotationRange
			? randomInRange(profile.initialRotationRange[0], profile.initialRotationRange[1])
			: 0;

		physics.vx[dataIdx] =
			randomInRange(profile.vxRange[0], profile.vxRange[1]) * settings.particleSpeedMultiplier;
		physics.vy[dataIdx] =
			randomInRange(profile.vyRange[0], profile.vyRange[1]) * settings.particleSpeedMultiplier;
		physics.gravity[dataIdx] = profile.gravity;
		physics.friction[dataIdx] = profile.friction;
		physics.rotationFactor[dataIdx] = profile.rotationFactor;

		const initScale = profile.initialScaleRange
			? randomInRange(profile.initialScaleRange[0], profile.initialScaleRange[1])
			: 1.0;
		render.initialScale[dataIdx] = initScale;
		render.currentScale[dataIdx] = initScale;
		render.targetScale[dataIdx] =
			profile.targetScale !== undefined ? profile.targetScale : initScale;

		const life = profile.baseLife * settings.particleLifespanMultiplier;
		lifecycle.life[dataIdx] = life;
		lifecycle.maxLife[dataIdx] = life;

		if (profile.isTracking && targetEntityId !== undefined)
			targeting.targetEntityId[dataIdx] = targetEntityId;
	}
};
