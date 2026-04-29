import * as os from "node:os";
import * as vscode from "vscode";

const MAX_SUSHI = 15;

export interface MemoryIndicator {
	start: (statusBarItem: vscode.StatusBarItem) => void;
	stop: () => void;
	update: (statusBarItem: vscode.StatusBarItem) => void;
	showDetails: () => void;
}

export const useMemoryIndicator = (): MemoryIndicator => {
	let intervalId: NodeJS.Timeout | undefined;

	const isWeb = vscode.env.uiKind === vscode.UIKind.Web;

	const start = (statusBarItem: vscode.StatusBarItem): void => {
		update(statusBarItem);
		if (!isWeb) intervalId = setInterval(() => update(statusBarItem), 2000);
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

		if (isWeb) {
			statusBarItem.text = "$(sushi-maguro)";
			statusBarItem.tooltip = "System Memory: N/A (Web Environment)";
			statusBarItem.show();
			return;
		}

		const extUsedMb = Math.round(process.memoryUsage().heapUsed / (1024 * 1024));
		const totalSysMem = os.totalmem();
		const freeSysMem = os.freemem();
		const usedSysMem = totalSysMem - freeSysMem;

		const totalSysGb = (totalSysMem / 1024 ** 3).toFixed(1);
		const usedSysGb = (usedSysMem / 1024 ** 3).toFixed(1);

		const memoryUsageRatio = usedSysMem / totalSysMem;
		let sushiCount = Math.ceil(memoryUsageRatio * MAX_SUSHI);
		sushiCount = Math.max(1, Math.min(sushiCount, MAX_SUSHI));

		statusBarItem.text = "$(sushi-maguro)".repeat(sushiCount);
		statusBarItem.tooltip = `System Memory: ${usedSysGb}GB / ${totalSysGb}GB\nExtension Memory: ${extUsedMb}MB`;
		statusBarItem.show();
	};

	const showDetails = (): void => {
		if (isWeb) {
			vscode.window
				.showInformationMessage(
					"$(sushi-maguro) Memory usage is unavailable on the web.",
					"Open Setting",
				)
				.then((selection) => {
					selection === "Open Setting" &&
						vscode.commands.executeCommand("workbench.action.openSettings", "sushiTheme");
				});
			return;
		}

		const memoryData = process.memoryUsage();
		const extUsedMemory = Math.round(memoryData.heapUsed / (1024 * 1024));
		const extRssMemory = Math.round(memoryData.rss / (1024 * 1024));

		const totalSysMem = os.totalmem();
		const freeSysMem = os.freemem();
		const usedSysGb = ((totalSysMem - freeSysMem) / 1024 ** 3).toFixed(1);
		const totalSysGb = (totalSysMem / 1024 ** 3).toFixed(1);

		vscode.window
			.showInformationMessage(
				`$🍣 System: ${usedSysGb}GB / ${totalSysGb}GB | Ext: ${extUsedMemory}MB (RSS: ${extRssMemory}MB)`,
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
