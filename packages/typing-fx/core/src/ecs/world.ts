import type { Registry } from "./registry";

export type System = (registry: Registry, dt: number) => void;

export interface WorldOptions {
	fps?: number;
	registry: Registry;
	systems: System[];
	onRender: (registry: Registry) => void;
}

export interface World {
	registry: Registry;
	startLoop: () => void;
	stopLoop: () => void;
	getRandomAliveEntityId: () => number;
	dispose: () => void;
}

export const useWorld = (options: WorldOptions): World => {
	const registry = options.registry;

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

		for (const system of options.systems) {
			system(registry, dt);
		}

		options.onRender(registry);
		scheduleNext();
	};

	const getRandomAliveEntityId = (): number => {
		return registry.getRandomAliveEntityId();
	};

	const dispose = (): void => {
		stopLoop();
		if (registry.activeCount > 0) {
			for (let i = registry.activeCount - 1; i >= 0; i--) {
				const entityId = registry.getEntityIdFromIndex(i);
				registry.destroyEntity(entityId);
			}
		}
		options.systems = [];
	};

	return {
		registry,
		startLoop,
		stopLoop,
		getRandomAliveEntityId,
		dispose,
	};
};
