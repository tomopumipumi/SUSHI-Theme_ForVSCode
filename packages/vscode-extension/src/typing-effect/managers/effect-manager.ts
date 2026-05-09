import { type CoreSettings, useWorld } from "@typing-fx/core";
import type * as vscode from "vscode";
import { useGameSettings } from "@/game-settings";
import { useRenderAdapter } from "../adapters/render-adapter";
import { EffectType } from "../constants";
import { useParticleEffect } from "../effects";
import { useLineHighlight } from "../effects/line-highlight";
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

	const feverDisposable = feverManager.onFeverStateChanged((isFever) => {
		if (isFever) {
			lineHighlight.start();
		} else {
			lineHighlight.stop();
		}
	});

	const coreSettings: CoreSettings = {
		get bounceTopDistance() {
			return settings.bounceTopDistance;
		},
		get bounceBottomDistance() {
			return settings.bounceBottomDistance;
		},
		get particleSpeedMultiplier() {
			return settings.particleSpeedMultiplier;
		},
		get particleLifespanMultiplier() {
			return settings.particleLifespanMultiplier;
		},
	};

	let onExplodeCallback: (
		targetId: string,
		anchorLine: number,
		anchorChar: number,
		x: number,
		y: number,
	) => void = () => {};

	const world = useWorld({
		settings: coreSettings,
		get fps() {
			return settings.fps;
		},
		onRender: (registry) => renderAdapter.updateDecorations(registry),
		onExplode: (targetId, anchorLine, anchorChar, x, y) =>
			onExplodeCallback(targetId, anchorLine, anchorChar, x, y),
	});

	const particleEffect = useParticleEffect(world);
	onExplodeCallback = particleEffect.spawnExplosion;

	const trigger = (combo: number, position: vscode.Position, editor: vscode.TextEditor): void => {
		if (settings.effectType === EffectType.none) return;
		if (combo >= settings.feverTriggerCombo && !feverManager.isFever) feverManager.start();
		particleEffect.trigger(settings, feverManager.isFever, combo, position, editor);
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
		particleEffect.dispose();
	};

	return { feverManager, trigger, clearParticlesForDocument, dispose };
};
