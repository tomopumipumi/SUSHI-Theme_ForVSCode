import * as vscode from "vscode";
import { EffectType, MAX_EFFECT_LEVEL, RANDOM_POOL } from "../constants";
import { useWorld } from "../ecs";
import { useLineHighlight } from "../effects";
import { type FeverManager, useFeverManager } from "./fever-manager";

export interface EffectManager {
	feverManager: FeverManager;
	trigger: (combo: number, position: vscode.Position, editor: vscode.TextEditor) => void;
	clearParticlesForDocument: (doc: vscode.TextDocument) => void;
	dispose: () => void;
}

export const useEffectManager = (): EffectManager => {
	const world = useWorld();
	const lineHighlight = useLineHighlight();
	let activeRandomType: string = EffectType.maguro;

	const feverManager = useFeverManager();

	feverManager.onFeverStateChanged((isFever) => {
		if (isFever) {
			lineHighlight.start();
		} else {
			lineHighlight.stop();
		}
	});

	const trigger = (combo: number, position: vscode.Position, editor: vscode.TextEditor): void => {
		const config = vscode.workspace.getConfiguration("sushiTheme");
		const effectType = config.get<string>("effectType", EffectType.random);

		if (effectType === EffectType.none) return;

		const defaultRawComboUnit = 10;
		const rawComboUnit = config.get<number>("comboUnit", defaultRawComboUnit);
		const comboUnit = Math.max(1, Number(rawComboUnit) || defaultRawComboUnit);
		const rawLevel = Math.floor(combo / comboUnit) + 1;
		const safeLevel = Math.min(rawLevel, MAX_EFFECT_LEVEL);

		const defaultRawFeverTriggerCombo = 50;
		const rawFeverTriggerCombo = config.get<number>(
			"feverTriggerCombo",
			defaultRawFeverTriggerCombo,
		);
		const feverTriggerCombo = Math.max(
			1,
			Number(rawFeverTriggerCombo) || defaultRawFeverTriggerCombo,
		);
		if (combo >= feverTriggerCombo && !feverManager.isFever) feverManager.start();

		const feverProcess = () => world.spawn(EffectType.fever, editor, position, safeLevel);
		const normalProcess = () => {
			let targetType = effectType;

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

	const clearParticlesForDocument = (doc: vscode.TextDocument): void => {
		world.killParticlesByDocument(doc);
	};

	const dispose = (): void => {
		world.dispose();
		lineHighlight.dispose();
		feverManager.dispose();
	};

	return { feverManager, trigger, clearParticlesForDocument, dispose };
};
