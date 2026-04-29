import * as vscode from "vscode";

const MAX_SUSHI = 15;
const ADJUSTED_MB_PER_SUSHI = 10;

export interface MemoryIndicator {
	start: (statusBarItem: vscode.StatusBarItem) => void;
	stop: () => void;
	update: (statusBarItem: vscode.StatusBarItem) => void;
	showDetails: () => void;
}

export const useMemoryIndicator = (): MemoryIndicator => {
	let intervalId: NodeJS.Timeout | undefined;

	const start = (statusBarItem: vscode.StatusBarItem): void => {
		update(statusBarItem);
		intervalId = setInterval(() => update(statusBarItem), 2000);
	};

	const stop = (): void => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = undefined;
		}
	};

	const update = (statusBarItem: vscode.StatusBarItem): void => {
		const config = vscode.workspace.getConfiguration("sushiTheme");
		if (!config.get<boolean>("enableStatusBar")) {
			statusBarItem.hide();
			return;
		}

		const usedMb = Math.round(process.memoryUsage().heapUsed / (1024 * 1024));
		let sushiCount = Math.floor(usedMb / ADJUSTED_MB_PER_SUSHI);
		sushiCount = Math.max(1, Math.min(sushiCount, MAX_SUSHI));

		statusBarItem.text = "$(sushi-maguro)".repeat(sushiCount);
		statusBarItem.tooltip = `System Memory Usage: ${usedMb}MB`;
		statusBarItem.show();
	};

	const showDetails = (): void => {
		const memoryData = process.memoryUsage();
		const usedMemory = Math.round(memoryData.heapUsed / (1024 * 1024));
		const totalMemory = Math.round(memoryData.heapTotal / (1024 * 1024));
		const rssMemory = Math.round(memoryData.rss / (1024 * 1024));

		vscode.window
			.showInformationMessage(
				`🍣 System Memory: Used: ${usedMemory}MB / Total: ${totalMemory}MB (RSS: ${rssMemory}MB)`,
				"Open Setting",
			)
			.then((selection) => {
				selection === "Open Setting" &&
					vscode.commands.executeCommand("workbench.action.openSettings", "sushiTheme");
			});
	};

	return {
		start,
		stop,
		update,
		showDetails,
	};
};
