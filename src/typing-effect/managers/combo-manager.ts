import * as vscode from "vscode";

export interface ComboManager {
	registerKeystroke(editor: vscode.TextEditor, position: vscode.Position): void;
	dispose: () => void;
}

interface UseComboManagerProps {
	onUpdate: (combo: number, position: vscode.Position, editor: vscode.TextEditor) => void;
}

export const useComboManager = ({ onUpdate }: UseComboManagerProps): ComboManager => {
	let comboCount = 0;
	let comboTimeout: NodeJS.Timeout | undefined;

	const resetCombo = (): void => {
		comboCount = 0;
	};

	const registerKeystroke = (editor: vscode.TextEditor, position: vscode.Position): void => {
		comboCount++;
		if (comboTimeout) clearTimeout(comboTimeout);

		const config = vscode.workspace.getConfiguration("sushiTheme");
		const defaultRawResetMs = 1500;
		const rawResetMs = config.get<number>("comboTimeoutMs", defaultRawResetMs);
		const resetMs = Math.max(1, Number(rawResetMs) || defaultRawResetMs);

		comboTimeout = setTimeout(() => resetCombo(), resetMs);
		onUpdate(comboCount, position, editor);
	};

	const dispose = (): void => {
		if (comboTimeout) clearTimeout(comboTimeout);
	};

	return {
		registerKeystroke,
		dispose,
	};
};
