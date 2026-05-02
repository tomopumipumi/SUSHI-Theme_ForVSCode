import * as vscode from "vscode";
import { EffectType } from "../constants";
import { COMPONENT_MASK } from "./constants";
import { Registry } from "./registry";
import { spawnEbi, spawnFever, spawnIkura, spawnMaguro, spawnMatcha } from "./spawners";
import { useLifecycleSystem, usePhysicsSystem, useRenderSystem } from "./systems";

const MS_PER_SECOND = 1000;
const BASE_FRAME_TIME_MS = 30;
const MAX_DELTA_TIME = 3.0;

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
		const bounceDistance = config.get<number>("bounceTopDistance", 100);

		physicsSystem.update(registry, dt, bounceDistance);
		lifecycleSystem.update(registry, dt);
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

		switch (type) {
			case EffectType.maguro:
				spawnMaguro(registry, editor, position, level, speedMultiplier);
				break;
			case EffectType.ikura:
				spawnIkura(registry, editor, position, level, speedMultiplier);
				break;
			case EffectType.ebi:
				spawnEbi(registry, editor, position, level, speedMultiplier);
				break;
			case EffectType.matcha:
				spawnMatcha(registry, editor, position, level, speedMultiplier);
				break;
			case EffectType.fever:
				spawnFever(registry, editor, position, speedMultiplier);
				break;
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
