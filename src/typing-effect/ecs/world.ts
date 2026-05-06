import type * as vscode from "vscode";
import { useGameSettings } from "@/game-settings";
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
	const { settings } = useGameSettings();

	const registry = new Registry();

	const systems = {
		physicsSystem: usePhysicsSystem(),
		lifecycleSystem: useLifecycleSystem(),
		renderSystem: useRenderSystem(),
		trackingSystem: useTrackingSystem(),
		animationSystem: useAnimationSystem(),
	};

	const activeTimeouts = new Set<NodeJS.Timeout>();

	let timer: NodeJS.Timeout | undefined;
	let lastTime = performance.now();

	const handleExplosion = (
		editor: vscode.TextEditor,
		range: vscode.Range,
		x: number,
		y: number,
	) => {
		spawnExplosion(registry, editor, range, x, y);
	};

	const startLoop = (): void => {
		if (timer) return;
		lastTime = performance.now();
		const intervalMs = Math.floor(MS_PER_SECOND / settings.fps);
		timer = setInterval(update, intervalMs);
	};

	const stopLoop = (): void => {
		if (timer === undefined) return;
		clearInterval(timer);
		timer = undefined;
	};

	const update = (): void => {
		const now = performance.now();

		let dt = (now - lastTime) / BASE_FRAME_TIME_MS;
		lastTime = now;

		if (dt > MAX_DELTA_TIME) dt = MAX_DELTA_TIME;

		if (registry.activeCount === 0) {
			systems.renderSystem.update(registry);
			stopLoop();
			return;
		}

		systems.trackingSystem.update(registry, dt, handleExplosion);
		systems.physicsSystem.update(
			registry,
			dt,
			settings.bounceTopDistance,
			settings.bounceBottomDistance,
		);
		systems.lifecycleSystem.update(registry, dt);
		systems.animationSystem.update(registry);
		systems.renderSystem.update(registry);
	};

	const spawn = (
		type: string,
		editor: vscode.TextEditor,
		position: vscode.Position,
		level: number,
	): void => {
		switch (type) {
			case EffectType.maguro:
				spawnMaguro(registry, editor, position, level);
				break;
			case EffectType.ikura:
				spawnIkura(registry, editor, position, level);
				break;
			case EffectType.ebi:
				spawnEbi(registry, editor, position, level);
				break;
			case EffectType.matcha:
				spawnMatcha(registry, editor, position, level);
				break;
			case EffectType.fever:
				spawnFever(registry, editor, position);
				break;
		}

		if (Math.random() < CHOPSTICKS_SPAWN_PROBABILITY) {
			const targetId = registry.getRandomAliveEntityId();
			if (registry.isValid(targetId)) {
				const t = setTimeout(() => {
					activeTimeouts.delete(t);
					if (registry.isValid(targetId)) {
						spawnChopsticks(registry, editor, position, targetId);
						startLoop();
					}
				}, CHOPSTICKS_SPAWN_DELAY_MS);
				activeTimeouts.add(t);
			}
		}

		startLoop();
	};

	const killParticlesByDocument = (closedDoc: vscode.TextDocument): void => {
		const { components, entityMasks, activeCount } = registry;
		const RequiredMask = COMPONENT_MASK.render | COMPONENT_MASK.lifecycle;

		for (let i = 0; i < activeCount; i++)
			if ((entityMasks[i] & RequiredMask) === RequiredMask)
				if (components.render.editors[i]?.document === closedDoc) components.lifecycle.life[i] = 0;
	};

	const dispose = (): void => {
		stopLoop();
		systems.renderSystem.dispose();
		for (const t of activeTimeouts) clearTimeout(t);
		activeTimeouts.clear();
	};

	return { spawn, dispose, killParticlesByDocument };
};
