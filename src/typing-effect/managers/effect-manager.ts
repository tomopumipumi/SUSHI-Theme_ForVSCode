import type * as vscode from "vscode";
import { useGameSettings } from "@/game-settings";
import { EffectType, RANDOM_POOL } from "../constants";
import { useWorld } from "../ecs";
import { useLineHighlight } from "../effects";
import type { EffectTypeKey } from "../types";
import { type FeverManager, useFeverManager } from "./fever-manager";

export interface EffectManager {
	feverManager: FeverManager;
	trigger: (combo: number, position: vscode.Position, editor: vscode.TextEditor) => void;
	clearParticlesForDocument: (doc: vscode.TextDocument) => void;
	dispose: () => void;
}

export const useEffectManager = (): EffectManager => {
	const { settings } = useGameSettings();
	const world = useWorld();
	const lineHighlight = useLineHighlight();
	let activeRandomType: EffectTypeKey = EffectType.maguro;

	const feverManager = useFeverManager();

	const feverDisposable = feverManager.onFeverStateChanged((isFever) => {
		if (isFever) {
			lineHighlight.start();
		} else {
			lineHighlight.stop();
		}
	});

	const trigger = (combo: number, position: vscode.Position, editor: vscode.TextEditor): void => {
		if (settings.effectType === EffectType.none) return;
		if (combo >= settings.feverTriggerCombo && !feverManager.isFever) feverManager.start();

		const rawLevel = Math.floor(combo / settings.comboUnit) + 1;
		const safeLevel = Math.min(rawLevel, 5);

		const feverProcess = () => world.spawn(EffectType.fever, editor, position, safeLevel);
		const normalProcess = () => {
			let targetType: EffectTypeKey = settings.effectType;

			if (targetType === EffectType.random) {
				if (combo === 1) {
					const randIndex = Math.floor(Math.random() * RANDOM_POOL.length);
					activeRandomType = RANDOM_POOL[randIndex];
				}
				targetType = activeRandomType;
			}

			world.spawn(targetType, editor, position, safeLevel);
		};

		if (feverManager.isFever) {
			feverProcess();
		} else {
			normalProcess();
		}
	};

	const clearParticlesForDocument = (doc: vscode.TextDocument): void =>
		world.killParticlesByDocument(doc);

	const dispose = (): void => {
		world.dispose();
		lineHighlight.dispose();
		feverManager.dispose();
		feverDisposable.dispose();
	};

	return { feverManager, trigger, clearParticlesForDocument, dispose };
};
