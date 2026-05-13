import type {
	AnimationComponent,
	LifecycleComponent,
	Registry,
	RenderComponent,
	TransformComponent,
} from "@typing-fx/core";
import type { ColliderComponent, PhysicsComponent } from "@typing-fx/physics-2d";
import type { TrackingComponent } from "@typing-fx/tracking";
import type { SushiSettings } from "@/game-settings";
import { COMPONENT_NAME } from "./constants";
import type { ParticleProfile } from "./types";

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

const CHAR_WIDTH = 10;
const LINE_HEIGHT = 20;

export const spawnParticles = (
	registry: Registry,
	settings: SushiSettings,
	profile: ParticleProfile,
	targetId: string,
	anchorLine: number,
	anchorChar: number,
	targetEntityId?: number,
): void => {
	const transform = registry.getComponent<TransformComponent>(COMPONENT_NAME.transform);
	const lifecycle = registry.getComponent<LifecycleComponent>(COMPONENT_NAME.lifecycle);
	const render = registry.getComponent<RenderComponent>(COMPONENT_NAME.render);
	const physics = registry.getComponent<PhysicsComponent>(COMPONENT_NAME.physics);

	if (!transform || !lifecycle || !render || !physics) return;

	let mask =
		registry.getComponentMask(COMPONENT_NAME.transform) |
		registry.getComponentMask(COMPONENT_NAME.lifecycle) |
		registry.getComponentMask(COMPONENT_NAME.render) |
		registry.getComponentMask(COMPONENT_NAME.physics);

	const animation = registry.getComponent<AnimationComponent>(COMPONENT_NAME.animation);
	const collider = registry.getComponent<ColliderComponent>(COMPONENT_NAME.collider);
	const targeting = registry.getComponent<TrackingComponent>(COMPONENT_NAME.tracking);

	if (profile.isTracking && targeting) mask |= registry.getComponentMask(COMPONENT_NAME.tracking);
	if (profile.isAnimation && Array.isArray(profile.graphic) && animation)
		mask |= registry.getComponentMask(COMPONENT_NAME.animation);
	if (settings.enableParticleCollision && collider)
		mask |= registry.getComponentMask(COMPONENT_NAME.collider);

	const estimatedX = anchorChar * CHAR_WIDTH;
	const estimatedY = anchorLine * LINE_HEIGHT;

	for (let i = 0; i < profile.count; i++) {
		const entityId = registry.createEntity(mask);
		if (entityId === -1) return;

		const dataIdx = registry.getComponentIndex(entityId);
		if (dataIdx === -1) continue;

		let initialSvgUrl = "";
		let initialWidth = 0;
		let initialHeight = 0;

		if (profile.isAnimation && Array.isArray(profile.graphic) && animation) {
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
		transform.baseX[dataIdx] = estimatedX;
		transform.baseY[dataIdx] = estimatedY;

		transform.x[dataIdx] =
			estimatedX +
			(profile.spawnSpreadX ? randomInRange(profile.spawnSpreadX[0], profile.spawnSpreadX[1]) : 0);
		transform.y[dataIdx] =
			estimatedY +
			(profile.spawnSpreadY ? randomInRange(profile.spawnSpreadY[0], profile.spawnSpreadY[1]) : 0);
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

		if (settings.enableParticleCollision && collider) {
			collider.radius[dataIdx] = Math.max(initialWidth, initialHeight) / 2;
			collider.restitution[dataIdx] = settings.particleRestitution;
			collider.mass[dataIdx] = 1.0;
			if (profile.isTracking) collider.isSensor[dataIdx] = 1;
		}

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

		if (profile.isTracking && targeting && targetEntityId !== undefined)
			targeting.targetEntityId[dataIdx] = targetEntityId;
	}
};
