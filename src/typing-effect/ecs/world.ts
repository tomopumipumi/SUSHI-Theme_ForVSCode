import type * as vscode from "vscode";
import { EffectType } from "../constants";
import { ParticleData } from "./components/particle-data";
import { spawnEbi, spawnFever, spawnIkura, spawnMaguro, spawnMatcha } from "./spawners";
import { useLifecycleSystem, usePhysicsSystem, useRenderSystem } from "./systems";

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
	const data = new ParticleData();

	const physicsSystem = usePhysicsSystem();
	const lifecycleSystem = useLifecycleSystem();
	const renderSystem = useRenderSystem();

	let timer: NodeJS.Timeout | undefined;
	let lastTime = performance.now();

	const startLoop = (): void => {
		if (timer) return;

		timer = setInterval(() => {
			update();
		}, 30);
	};

	const stopLoop = (): void => {
		if (timer) {
			clearInterval(timer);
			timer = undefined;
		}
	};

	const update = (): void => {
		const now = performance.now();
		const dt = (now - lastTime) / 30;
		lastTime = now;
		if (data.activeCount === 0) {
			renderSystem.update(data);
			stopLoop();
			return;
		}

		physicsSystem.update(data, dt);

		lifecycleSystem.update(data);
		renderSystem.update(data);
	};

	const spawn = (
		type: string,
		editor: vscode.TextEditor,
		position: vscode.Position,
		level: number,
	): void => {
		switch (type) {
			case EffectType.maguro:
				spawnMaguro(data, editor, position, level);
				break;
			case EffectType.ikura:
				spawnIkura(data, editor, position, level);
				break;
			case EffectType.ebi:
				spawnEbi(data, editor, position, level);
				break;
			case EffectType.matcha:
				spawnMatcha(data, editor, position, level);
				break;
			case EffectType.fever:
				spawnFever(data, editor, position);
				break;
			default:
				break;
		}

		startLoop();
	};

	const killParticlesByDocument = (closedDoc: vscode.TextDocument): void => {
		const count = data.activeCount;
		const { editors, life } = data;

		for (let i = 0; i < count; i++) {
			if (editors[i]?.document === closedDoc) {
				life[i] = 0;
			}
		}
	};

	const dispose = (): void => {
		stopLoop();
		renderSystem.dispose();
	};

	return { spawn, dispose, killParticlesByDocument };
};
