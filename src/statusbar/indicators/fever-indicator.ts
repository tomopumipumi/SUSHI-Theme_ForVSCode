import * as vscode from "vscode";

export interface FeverIndicator {
	start: (statusBarItem: vscode.StatusBarItem) => void;
	stop: (statusBarItem: vscode.StatusBarItem) => void;
}

export const useFeverIndicator = (): FeverIndicator => {
	let intervalId: NodeJS.Timeout | undefined;

	const start = (statusBarItem: vscode.StatusBarItem): void => {
		let frame = 0;
		const width = 12;

		if (intervalId) clearInterval(intervalId);

		statusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");

		statusBarItem.color = new vscode.ThemeColor("statusBarItem.warningForeground");

		statusBarItem.tooltip = "🔥 FEVER TIME !!! 🔥";
		statusBarItem.show();

		intervalId = setInterval(() => {
			const position = Math.abs((frame % (width * 2)) - width);
			const leftSpaces = "　".repeat(position);
			const rightSpaces = "　".repeat(width - position);

			statusBarItem.text = `$(sushi-fire)${leftSpaces}$(sushi-maguro) FEVER TIME! $(sushi-maguro)${rightSpaces}$(sushi-fire)`;
			frame++;
		}, 100);
	};

	const stop = (statusBarItem: vscode.StatusBarItem): void => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = undefined;
		}
		statusBarItem.backgroundColor = undefined;
		statusBarItem.color = undefined;
	};

	return { start, stop };
};
