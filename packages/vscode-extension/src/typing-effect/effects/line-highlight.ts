import * as vscode from "vscode";

export interface LineHighlight {
	start: () => void;
	stop: () => void;
	dispose: () => void;
}

export const useLineHighlight = (): LineHighlight => {
	let selectionDisposable: vscode.Disposable | undefined;

	let lastHighlightedLine: number | undefined;

	const feverLineDeco = vscode.window.createTextEditorDecorationType({
		isWholeLine: true,
		backgroundColor: "rgba(255, 215, 0, 0.15)",
		borderWidth: "1px 0",
		borderColor: "rgba(255, 215, 0, 0.8)",
		borderStyle: "solid",
	});

	const updateLineHighlight = (): void => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const position = editor.selection.active;

		if (lastHighlightedLine === position.line) return;

		clearLineHighlight();

		const range = new vscode.Range(position, position);

		editor.setDecorations(feverLineDeco, [range]);

		lastHighlightedLine = position.line;
	};

	const clearLineHighlight = (): void => {
		for (const editor of vscode.window.visibleTextEditors) editor.setDecorations(feverLineDeco, []);
		lastHighlightedLine = undefined;
	};

	const start = (): void => {
		if (selectionDisposable) return;
		updateLineHighlight();
		selectionDisposable = vscode.window.onDidChangeTextEditorSelection(updateLineHighlight);
	};

	const stop = (): void => {
		if (selectionDisposable) {
			selectionDisposable.dispose();
			selectionDisposable = undefined;
		}
		clearLineHighlight();
	};

	const dispose = (): void => {
		stop();
		feverLineDeco.dispose();
	};

	return { start, stop, dispose };
};
