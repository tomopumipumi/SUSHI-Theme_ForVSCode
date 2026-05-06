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
	const { render, transform, physics, lifecycle, targeting } = registry.components;

	let mask = DEFAULT_PARTICLE_MASK;
	if (config.isTracking) mask |= COMPONENT_MASK.targeting;

	for (let i = 0; i < config.count; i++) {
		const entityId = registry.createEntity(mask);
		if (entityId === -1) return;

		const dataIdx = registry.getComponentIndex(entityId);
		if (dataIdx === -1) continue;

		const graphic = Array.isArray(config.graphic)
			? config.graphic[Math.floor(Math.random() * config.graphic.length)]
			: config.graphic;

		render.targetIds[dataIdx] = targetId;
		render.anchorLine[dataIdx] = anchorLine;
		render.anchorChar[dataIdx] = anchorChar;
		render.svgUrls[dataIdx] = graphic.svgUrl;
		render.width[dataIdx] = graphic.width;
		render.height[dataIdx] = graphic.height;

		transform.x[dataIdx] = config.isTracking ? randomInRange(-50, 50) : 0;
		transform.y[dataIdx] = config.isTracking ? -50 : 0;
		transform.rotation[dataIdx] = config.isTracking ? 0 : Math.random() * 360;

		physics.vx[dataIdx] =
			randomInRange(config.vxRange[0], config.vxRange[1]) * settings.particleSpeedMultiplier;
		physics.vy[dataIdx] =
			randomInRange(config.vyRange[0], config.vyRange[1]) * settings.particleSpeedMultiplier;
		physics.gravity[dataIdx] = config.gravity;
		physics.friction[dataIdx] = config.friction;
		physics.rotationFactor[dataIdx] = config.rotationFactor;

		const life = config.baseLife * settings.particleLifespanMultiplier;
		lifecycle.life[dataIdx] = life;
		lifecycle.maxLife[dataIdx] = life;

		if (config.isTracking && targetEntityId !== undefined) {
			targeting.targetEntityId[dataIdx] = targetEntityId;
		}
	}
};
