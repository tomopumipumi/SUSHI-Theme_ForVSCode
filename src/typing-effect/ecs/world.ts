import * as vscode from "vscode";
import { EffectType } from "../constants";
import { COMPONENT_MASK } from "./constants";
import { Registry } from "./registry";
import {
	spawnChopsticks,
	spawnEbi,
	spawnExplosion,
	spawnFever,
	spawnIkura,
	spawnMaguro,
	spawnMatcha,
} from "./spawners";
import {
	useAnimationSystem,
	useLifecycleSystem,
	usePhysicsSystem,
	useRenderSystem,
} from "./systems";
import { useTrackingSystem } from "./systems/tracking-system";

const MS_PER_SECOND = 1000;
const BASE_FRAME_TIME_MS = 30;
const MAX_DELTA_TIME = 3.0;
const CHOPSTICKS_SPAWN_PROBABILITY = 0.05;
const CHOPSTICKS_SPAWN_DELAY_MS = 400;

export interface World {
	spawn: (
		type: string,
		editor: vscode.TextEditor,
		position: vscode.Position,
		level: number,
	) => void;
	dispose: () => void;
	killParticlesByDocument: (closedDoc: vscode.TextDocument) => void;
}

export const useWorld = (): World => {
	const registry = new Registry();

	const physicsSystem = usePhysicsSystem();
	const lifecycleSystem = useLifecycleSystem();
	const renderSystem = useRenderSystem();
	const trackingSystem = useTrackingSystem();
	const animationSystem = useAnimationSystem();

	const handleExplosion = (
		editor: vscode.TextEditor,
		range: vscode.Range,
		x: number,
		y: number,
	) => {
		spawnExplosion(registry, editor, range, x, y);
	};

	let timer: NodeJS.Timeout | undefined;
	let lastTime = performance.now();

	const startLoop = (): void => {
		if (timer) return;

		lastTime = performance.now();

		const getIntervalMsFromFPS = (): number => {
			const config = vscode.workspace.getConfiguration("sushiTheme");
			const fps = config.get<number>("fps", BASE_FRAME_TIME_MS);
			return Math.floor(MS_PER_SECOND / fps);
		};

		const intervalMs = getIntervalMsFromFPS();

		timer = setInterval(() => {
			update();
		}, intervalMs);
	};

	const stopLoop = (): void => {
		if (timer) {
			clearInterval(timer);
			timer = undefined;
		}
	};

	const update = (): void => {
		const now = performance.now();

		let dt = (now - lastTime) / BASE_FRAME_TIME_MS;
		lastTime = now;

		if (dt > MAX_DELTA_TIME) dt = MAX_DELTA_TIME;

		if (registry.activeCount === 0) {
			renderSystem.update(registry);
			stopLoop();
			return;
		}

		const config = vscode.workspace.getConfiguration("sushiTheme");
		const bounceTopDistance = config.get<number>("bounceTopDistance", 100);
		const bounceBottomDistance = config.get<number>("bounceBottomDistance", 0);

		trackingSystem.update(registry, dt, handleExplosion);
		physicsSystem.update(registry, dt, bounceTopDistance, bounceBottomDistance);
		lifecycleSystem.update(registry, dt);
		animationSystem.update(registry);
		renderSystem.update(registry);
	};

	const spawn = (
		type: string,
		editor: vscode.TextEditor,
		position: vscode.Position,
		level: number,
	): void => {
		const config = vscode.workspace.getConfiguration("sushiTheme");
		const speedMultiplier = config.get<number>("particleSpeedMultiplier", 1.0);
		const lifeMultiplier = config.get<number>("particleLifespanMultiplier", 1.0);

		switch (type) {
			case EffectType.maguro:
				spawnMaguro(registry, editor, position, level, speedMultiplier, lifeMultiplier);
				break;
			case EffectType.ikura:
				spawnIkura(registry, editor, position, level, speedMultiplier, lifeMultiplier);
				break;
			case EffectType.ebi:
				spawnEbi(registry, editor, position, level, speedMultiplier, lifeMultiplier);
				break;
			case EffectType.matcha:
				spawnMatcha(registry, editor, position, level, speedMultiplier, lifeMultiplier);
				break;
			case EffectType.fever:
				spawnFever(registry, editor, position, speedMultiplier, lifeMultiplier);
				break;
		}

		if (Math.random() < CHOPSTICKS_SPAWN_PROBABILITY) {
			const targetId = registry.getRandomAliveEntityId();
			if (registry.isValid(targetId)) {
				setTimeout(() => {
					if (registry.isValid(targetId)) {
						spawnChopsticks(registry, editor, position, targetId);
						startLoop();
					}
				}, CHOPSTICKS_SPAWN_DELAY_MS);
			}
		}

		startLoop();
	};

	const killParticlesByDocument = (closedDoc: vscode.TextDocument): void => {
		const { components, entityMasks, activeCount } = registry;
		const RequiredMask = COMPONENT_MASK.render | COMPONENT_MASK.lifecycle;

		for (let i = 0; i < activeCount; i++) {
			if ((entityMasks[i] & RequiredMask) === RequiredMask)
				if (components.render.editors[i]?.document === closedDoc) components.lifecycle.life[i] = 0;
		}
	};

	const dispose = (): void => {
		stopLoop();
		renderSystem.dispose();
	};

	return { spawn, dispose, killParticlesByDocument };
};
