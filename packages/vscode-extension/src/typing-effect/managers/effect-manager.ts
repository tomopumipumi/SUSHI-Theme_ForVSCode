import { type CoreSettings, useWorld } from "@typing-fx/core";
import type * as vscode from "vscode";
import { useGameSettings } from "@/game-settings";
import { useRenderAdapter } from "../adapters/render-adapter";
import { EffectType, RANDOM_POOL } from "../constants";
import { useLineHighlight } from "../effects/line-highlight";
import {
	getChopsticksConfig,
	getEbiConfig,
	getFeverConfig,
	getIkuraConfig,
	getMaguroConfig,
	getMatchaConfig,
} from "../theme-configs";
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
	const lineHighlight = useLineHighlight();
	const feverManager = useFeverManager();
	const renderAdapter = useRenderAdapter();

	let activeRandomType: EffectTypeKey = EffectType.maguro;
	const activeTimeouts = new Set<NodeJS.Timeout>();

	const feverDisposable = feverManager.onFeverStateChanged((isFever) => {
		if (isFever) {
			lineHighlight.start();
		} else {
			lineHighlight.stop();
		}
	});

	const coreSettings: CoreSettings = {
		bounceTopDistance: settings.bounceTopDistance,
		bounceBottomDistance: settings.bounceBottomDistance,
		particleSpeedMultiplier: settings.particleSpeedMultiplier,
		particleLifespanMultiplier: settings.particleLifespanMultiplier,
	};

	const world = useWorld({
		settings: coreSettings,
		fps: settings.fps,
		onRender: (registry) => {
			renderAdapter.updateDecorations(registry);
		},
		onExplode: (targetId, anchorLine, anchorChar, x, y) => {
			const explodeConfig = getMaguroConfig(1);
			world.spawn(explodeConfig, targetId, anchorLine, anchorChar);
		},
	});

	const trigger = (combo: number, position: vscode.Position, editor: vscode.TextEditor): void => {
		if (settings.effectType === EffectType.none) return;

		if (combo >= settings.feverTriggerCombo && !feverManager.isFever) {
			feverManager.start();
		}

		const rawLevel = Math.floor(combo / settings.comboUnit) + 1;
		const safeLevel = Math.min(rawLevel, 5);

		const targetId = editor.document.uri.toString();
		const anchorLine = position.line;
		const anchorChar = position.character;

		let config;
		if (feverManager.isFever) {
			config = getFeverConfig(settings.feverSpawnCount);
		} else {
			let targetType: EffectTypeKey = settings.effectType;

			if (targetType === EffectType.random) {
				if (combo === 1) {
					const randIndex = Math.floor(Math.random() * RANDOM_POOL.length);
					activeRandomType = RANDOM_POOL[randIndex];
				}
				targetType = activeRandomType;
			}

			switch (targetType) {
				case EffectType.maguro:
					config = getMaguroConfig(safeLevel);
					break;
				case EffectType.ikura:
					config = getIkuraConfig(safeLevel);
					break;
				case EffectType.ebi:
					config = getEbiConfig(safeLevel);
					break;
				case EffectType.matcha:
					config = getMatchaConfig(safeLevel);
					break;
				default:
					config = getMaguroConfig(safeLevel);
					break;
			}
		}

		world.spawn(config, targetId, anchorLine, anchorChar);

		if (Math.random() < 0.05) {
			const targetEntityId = world.getRandomAliveEntityId();
			if (targetEntityId !== -1) {
				const t = setTimeout(() => {
					activeTimeouts.delete(t);
					world.spawn(getChopsticksConfig(), targetId, anchorLine, anchorChar, targetEntityId);
				}, 400);
				activeTimeouts.add(t);
			}
		}
	};

	const clearParticlesForDocument = (doc: vscode.TextDocument): void => {
		world.clearParticlesByTarget(doc.uri.toString());
	};

	const dispose = (): void => {
		world.dispose();
		renderAdapter.dispose();
		lineHighlight.dispose();
		feverManager.dispose();
		feverDisposable.dispose();
		for (const t of activeTimeouts) clearTimeout(t);
		activeTimeouts.clear();
	};

	return { feverManager, trigger, clearParticlesForDocument, dispose };
};
