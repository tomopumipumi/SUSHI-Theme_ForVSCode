import * as vscode from "vscode";

export interface FeverManager {
	onFeverStateChanged: vscode.Event<boolean>;
	readonly isFever: boolean;
	start: () => void;
	stop: () => void;
	dispose: () => void;
}

export const useFeverManager = (): FeverManager => {
	let _isFever: boolean = false;

	let feverTimeout: NodeJS.Timeout | undefined;

	const _onFeverStateChanged = new vscode.EventEmitter<boolean>();
	const onFeverStateChanged = _onFeverStateChanged.event;

	const start = (): void => {
		if (_isFever) return;

		_isFever = true;
		_onFeverStateChanged.fire(true);

		if (feverTimeout) clearTimeout(feverTimeout);

		const config = vscode.workspace.getConfiguration("sushiTheme");
		const rawDurationMs = config.get<number>("feverDurationMs", 10000);
		const durationMs = Math.max(1, Number(rawDurationMs) || 10000);

		feverTimeout = setTimeout(() => {
			stop();
		}, durationMs);
	};

	const stop = (): void => {
		if (!_isFever) return;

		_isFever = false;
		_onFeverStateChanged.fire(false);

		if (feverTimeout) {
			clearTimeout(feverTimeout);
			feverTimeout = undefined;
		}
	};

	const dispose = (): void => {
		stop();
		_onFeverStateChanged.dispose();
	};

	return {
		onFeverStateChanged,
		get isFever() {
			return _isFever;
		},
		start,
		stop,
		dispose,
	};
};
