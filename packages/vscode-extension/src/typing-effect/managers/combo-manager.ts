import type * as vscode from "vscode";
import { useGameSettings } from "@/game-settings";

export interface ComboManager {
	registerKeystroke(editor: vscode.TextEditor, position: vscode.Position): void;
	dispose: () => void;
}

interface UseComboManagerProps {
	onUpdate: (combo: number, position: vscode.Position, editor: vscode.TextEditor) => void;
}

export const useComboManager = ({ onUpdate }: UseComboManagerProps): ComboManager => {
	const { settings } = useGameSettings();

	let comboCount = 0;
	let comboTimeout: NodeJS.Timeout | undefined;

	let lastUpdateTime = 0;

	const resetCombo = (): void => {
		comboCount = 0;
	};

	const registerKeystroke = (editor: vscode.TextEditor, position: vscode.Position): void => {
		comboCount++;
		if (comboTimeout) clearTimeout(comboTimeout);

		comboTimeout = setTimeout(resetCombo, settings.comboTimeoutMs);
		const now = Date.now();
		if (now - lastUpdateTime >= settings.throttleMs) {
			lastUpdateTime = now;
			onUpdate(comboCount, position, editor);
		}
	};

	const dispose = (): void => {
		if (comboTimeout) clearTimeout(comboTimeout);
	};

	return {
		registerKeystroke,
		dispose,
	};
};
