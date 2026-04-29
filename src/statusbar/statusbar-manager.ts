import * as vscode from "vscode";
import { useFeverIndicator, useMemoryIndicator } from "./indicators";

const COMMAND_ID = "sushiTheme.showMemoryDetails";

interface StatusBarManager {
	setFeverMode: (isFever: boolean) => void;
	dispose: () => void;
}

export const useStatusBarManager = (ctx: vscode.ExtensionContext): StatusBarManager => {
	const statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100,
	);
	const memoryIndicator = useMemoryIndicator();
	const feverIndicator = useFeverIndicator();

	let isFeverMode: boolean = false;

	statusBarItem.command = COMMAND_ID;

	ctx.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_ID, () => memoryIndicator.showDetails()),
	);

	ctx.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((e) => {
			e.affectsConfiguration("sushiTheme.enableStatusBar") &&
				!isFeverMode &&
				memoryIndicator.update(statusBarItem);
		}),
	);

	ctx.subscriptions.push(statusBarItem);

	memoryIndicator.start(statusBarItem);

	const setFeverMode = (isFever: boolean): void => {
		if (isFeverMode === isFever) return;
		isFeverMode = isFever;

		const feverProcess = () => {
			memoryIndicator.stop();
			feverIndicator.start(statusBarItem);
		};

		const normalProcess = () => {
			feverIndicator.stop(statusBarItem);
			memoryIndicator.start(statusBarItem);
		};

		isFever ? feverProcess() : normalProcess();
	};

	const dispose = (): void => {
		memoryIndicator.stop();
		feverIndicator.stop(statusBarItem);
		statusBarItem.dispose();
	};

	return { setFeverMode, dispose };
};
