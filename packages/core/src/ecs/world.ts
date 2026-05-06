import type { CoreSettings, ParticleThemeConfig } from "../types";
import { COMPONENT_MASK } from "./constants";
import { Registry } from "./registry";
import { spawnGenericParticles } from "./spawner";
import {
	updateAnimationSystem,
	updateLifecycleSystem,
	updatePhysicsSystem,
	updateTrackingSystem,
} from "./systems";

export interface WorldOptions {
	settings: CoreSettings;
	fps?: number;
	onRender: (registry: Registry) => void;
	onExplode?: (
		targetId: string,
		anchorLine: number,
		anchorChar: number,
		x: number,
		y: number,
	) => void;
}

export interface World {
	registry: Registry;
	spawn: (
		config: ParticleThemeConfig,
		targetId: string,
		anchorLine: number,
		anchorChar: number,
		targetEntityId?: number,
	) => void;
	clearParticlesByTarget: (targetId: string) => void;
	getRandomAliveEntityId: () => number;
	dispose: () => void;
}

export const useWorld = (options: WorldOptions): World => {
	const registry = new Registry();
	const fps = options.fps || 30;
	const intervalMs = Math.floor(1000 / fps);

	let timer: ReturnType<typeof setInterval> | undefined;
	let lastTime = Date.now();

	const startLoop = (): void => {
		if (timer) return;
		lastTime = Date.now();
		timer = setInterval(update, intervalMs);
	};

	const stopLoop = (): void => {
		if (timer === undefined) return;
		clearInterval(timer);
		timer = undefined;
	};

	const update = (): void => {
		const now = Date.now();
		let dt = (now - lastTime) / 33.3;
		lastTime = now;

		if (dt > 3.0) dt = 3.0;

		if (registry.activeCount === 0) {
			options.onRender(registry);
			stopLoop();
			return;
		}

		if (options.onExplode) {
			updateTrackingSystem(registry, dt, options.onExplode);
		}
		updatePhysicsSystem(registry, dt, options.settings);
		updateLifecycleSystem(registry, dt);
		updateAnimationSystem(registry);

		options.onRender(registry);
	};

	const spawn = (
		config: ParticleThemeConfig,
		targetId: string,
		anchorLine: number,
		anchorChar: number,
		targetEntityId?: number,
	): void => {
		spawnGenericParticles(
			registry,
			options.settings,
			config,
			targetId,
			anchorLine,
			anchorChar,
			targetEntityId,
		);
		startLoop();
	};

	const clearParticlesByTarget = (targetId: string): void => {
		const { components, entityMasks, activeCount } = registry;
		const RequiredMask = COMPONENT_MASK.render | COMPONENT_MASK.lifecycle;

		for (let i = 0; i < activeCount; i++) {
			if ((entityMasks[i] & RequiredMask) === RequiredMask) {
				if (components.render.targetIds[i] === targetId) {
					components.lifecycle.life[i] = 0;
				}
			}
		}
	};

	const getRandomAliveEntityId = (): number => {
		return registry.getRandomAliveEntityId();
	};

	const dispose = (): void => {
		stopLoop();
	};

	return {
		registry,
		spawn,
		clearParticlesByTarget,
		getRandomAliveEntityId,
		dispose,
	};
};
