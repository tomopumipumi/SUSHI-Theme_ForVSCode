import type { CoreSettings } from "../types";
import { Registry } from "./registry";
import {
	updateAnimationSystem,
	updateCollisionSystem,
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
	startLoop: () => void;
	getRandomAliveEntityId: () => number;
	dispose: () => void;
}

export const useWorld = (options: WorldOptions): World => {
	const registry = new Registry();

	let timer: ReturnType<typeof setTimeout> | undefined;
	let lastTime = Date.now();

	const scheduleNext = (): void => {
		const currentFps = options.fps || 30;
		const intervalMs = Math.floor(1000 / currentFps);
		timer = setTimeout(update, intervalMs);
	};

	const startLoop = (): void => {
		if (timer) return;
		lastTime = Date.now();
		scheduleNext();
	};

	const stopLoop = (): void => {
		if (timer === undefined) return;
		clearTimeout(timer);
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

		if (options.onExplode) updateTrackingSystem(registry, dt, options.onExplode);

		updatePhysicsSystem(registry, dt, options.settings);
		if (options.settings.enableParticleCollision) updateCollisionSystem(registry);
		updateLifecycleSystem(registry, dt);
		updateAnimationSystem(registry);

		options.onRender(registry);

		scheduleNext();
	};

	const getRandomAliveEntityId = (): number => {
		return registry.getRandomAliveEntityId();
	};

	const dispose = (): void => {
		stopLoop();
	};

	return {
		registry,
		startLoop,
		getRandomAliveEntityId,
		dispose,
	};
};
