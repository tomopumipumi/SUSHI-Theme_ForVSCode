import type { CoreSettings, ParticleThemeConfig } from "../types";
import { COMPONENT_MASK, DEFAULT_PARTICLE_MASK } from "./constants";
import type { Registry } from "./registry";

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

export const spawnGenericParticles = (
	registry: Registry,
	settings: CoreSettings,
	config: ParticleThemeConfig,
	targetId: string,
	anchorLine: number,
	anchorChar: number,
	targetEntityId?: number,
): void => {
	const { render, transform, physics, lifecycle, targeting, animation } = registry.components;

	let mask = DEFAULT_PARTICLE_MASK;
	if (config.isTracking) mask |= COMPONENT_MASK.targeting;

	if (config.isAnimation && Array.isArray(config.graphic)) mask |= COMPONENT_MASK.animation;

	for (let i = 0; i < config.count; i++) {
		const entityId = registry.createEntity(mask);
		if (entityId === -1) return;

		const dataIdx = registry.getComponentIndex(entityId);
		if (dataIdx === -1) continue;

		let initialSvgUrl = "";
		let initialWidth = 0;
		let initialHeight = 0;

		if (config.isAnimation && Array.isArray(config.graphic)) {
			animation.frames[dataIdx] = config.graphic;
			initialSvgUrl = config.graphic[0].svgUrl;
			initialWidth = config.graphic[0].width;
			initialHeight = config.graphic[0].height;
		} else {
			const graphic = Array.isArray(config.graphic)
				? config.graphic[Math.floor(Math.random() * config.graphic.length)]
				: config.graphic;
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

		transform.x[dataIdx] = config.spawnSpreadX
			? randomInRange(config.spawnSpreadX[0], config.spawnSpreadX[1])
			: 0;
		transform.y[dataIdx] = config.spawnSpreadY
			? randomInRange(config.spawnSpreadY[0], config.spawnSpreadY[1])
			: 0;
		transform.rotation[dataIdx] = config.initialRotationRange
			? randomInRange(config.initialRotationRange[0], config.initialRotationRange[1])
			: 0;

		physics.vx[dataIdx] =
			randomInRange(config.vxRange[0], config.vxRange[1]) * settings.particleSpeedMultiplier;
		physics.vy[dataIdx] =
			randomInRange(config.vyRange[0], config.vyRange[1]) * settings.particleSpeedMultiplier;
		physics.gravity[dataIdx] = config.gravity;
		physics.friction[dataIdx] = config.friction;
		physics.rotationFactor[dataIdx] = config.rotationFactor;

		const initScale = config.initialScaleRange
			? randomInRange(config.initialScaleRange[0], config.initialScaleRange[1])
			: 1.0;
		render.initialScale[dataIdx] = initScale;
		render.currentScale[dataIdx] = initScale;
		render.targetScale[dataIdx] = config.targetScale !== undefined ? config.targetScale : initScale;

		const life = config.baseLife * settings.particleLifespanMultiplier;
		lifecycle.life[dataIdx] = life;
		lifecycle.maxLife[dataIdx] = life;

		if (config.isTracking && targetEntityId !== undefined) {
			targeting.targetEntityId[dataIdx] = targetEntityId;
		}
	}
};
