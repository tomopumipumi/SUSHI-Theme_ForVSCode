import * as vscode from "vscode";
import { useGameSettings } from "@/game-settings";

export interface FeverManager {
	onFeverStateChanged: vscode.Event<boolean>;
	readonly isFever: boolean;
	start: () => void;
	stop: () => void;
	dispose: () => void;
}

export const useFeverManager = (): FeverManager => {
	const { settings } = useGameSettings();
	let _isFever: boolean = false;

	let feverTimeout: NodeJS.Timeout | undefined;

	const _onFeverStateChanged = new vscode.EventEmitter<boolean>();
	const onFeverStateChanged = _onFeverStateChanged.event;

	const start = (): void => {
		if (_isFever) return;
		_isFever = true;
		_onFeverStateChanged.fire(true);
		if (feverTimeout) clearTimeout(feverTimeout);
		feverTimeout = setTimeout(stop, settings.feverDurationMs);
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
