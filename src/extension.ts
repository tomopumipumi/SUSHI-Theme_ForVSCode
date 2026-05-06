import * as vscode from "vscode";
import { useGameSettings } from "@/game-settings";
import { useStatusBarManager } from "@/statusbar/statusbar-manager";
import { EffectType } from "@/typing-effect/constants";
import { useComboManager, useEffectManager } from "@/typing-effect/managers";

export function activate(context: vscode.ExtensionContext): void {
	const { settings, register } = useGameSettings();
	register(context);

	const effectManager = useEffectManager();
	const comboManager = useComboManager({ onUpdate: effectManager.trigger });
	const statusBarManager = useStatusBarManager(context);

	effectManager.feverManager.onFeverStateChanged((isFever) =>
		statusBarManager.setFeverMode(isFever),
	);

	context.subscriptions.push(
		{ dispose: () => comboManager.dispose() },
		{ dispose: () => effectManager.dispose() },
		{ dispose: () => statusBarManager.dispose() },
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument((e) => {
			if (settings.effectType === EffectType.none) return;

			const editor = vscode.window.activeTextEditor;
			if (editor && e.document === editor.document && e.contentChanges.length > 0) {
				const change = e.contentChanges[0];
				comboManager.registerKeystroke(editor, change.range.start);
			}
		}),

		vscode.workspace.onDidCloseTextDocument((closedDoc) =>
			effectManager.clearParticlesForDocument(closedDoc),
		),
	);
}
