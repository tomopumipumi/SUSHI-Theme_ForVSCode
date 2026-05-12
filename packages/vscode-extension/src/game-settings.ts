import * as vscode from "vscode";
import { EffectType } from "./typing-effect/constants";
import type { EffectTypeKey } from "./typing-effect/types";

export interface SushiSettings {
	fps: number;
	bounceTopDistance: number;
	bounceBottomDistance: number;
	particleSpeedMultiplier: number;
	particleLifespanMultiplier: number;
	enableParticleCollision: boolean;
	particleRestitution: number;
	effectType: EffectTypeKey;
	comboUnit: number;
	feverTriggerCombo: number;
	feverDurationMs: number;
	feverSpawnCount: number;
	comboTimeoutMs: number;
	throttleMs: number;
	enableStatusBar: boolean;
}

const currentConfig: SushiSettings = {
	fps: 30,
	bounceTopDistance: 100,
	bounceBottomDistance: 0,
	particleSpeedMultiplier: 1.0,
	particleLifespanMultiplier: 1.0,
	enableParticleCollision: false,
	particleRestitution: 0.8,
	effectType: EffectType.random,
	comboUnit: 10,
	feverTriggerCombo: 50,
	feverDurationMs: 10000,
	feverSpawnCount: 5,
	comboTimeoutMs: 1500,
	throttleMs: 80,
	enableStatusBar: true,
};

const clamp = (val: unknown, min: number, max: number, fallback: number): number => {
	const num = Number(val);
	if (Number.isNaN(num) || val === null || val === undefined) return fallback;
	return Math.min(Math.max(num, min), max);
};

export interface GameSettings {
	register: (context: vscode.ExtensionContext) => void;
	readonly settings: SushiSettings;
}

export const useGameSettings = (): GameSettings => {
	const updateSettings = (): void => {
		const rawSettings = vscode.workspace.getConfiguration("sushiTheme");

		const rawEffect = rawSettings.get<string>("effectType", EffectType.random);
		const isValidEffect = Object.values(EffectType).includes(rawEffect as EffectTypeKey);
		const safeEffectType = isValidEffect ? (rawEffect as EffectTypeKey) : EffectType.random;

		Object.assign(currentConfig, {
			fps: clamp(rawSettings.get("fps"), 1, 120, 30),
			feverSpawnCount: clamp(rawSettings.get("feverSpawnCount"), 1, 50, 5),

			bounceTopDistance: Number(rawSettings.get("bounceTopDistance")) || 200,
			bounceBottomDistance: Number(rawSettings.get("bounceBottomDistance")) || 0,
			particleSpeedMultiplier: clamp(rawSettings.get("particleSpeedMultiplier"), 0.1, 5.0, 1.3),
			particleLifespanMultiplier: clamp(
				rawSettings.get("particleLifespanMultiplier"),
				0.1,
				50.0,
				1.0,
			),

			enableParticleCollision: Boolean(rawSettings.get("enableParticleCollision", false)),
			particleRestitution: clamp(rawSettings.get("particleRestitution"), 0.0, 2.0, 0.8),

			effectType: safeEffectType,

			comboUnit: clamp(rawSettings.get("comboUnit"), 1, 1000, 5),
			feverTriggerCombo: clamp(rawSettings.get("feverTriggerCombo"), 1, 1000, 50),
			feverDurationMs: clamp(rawSettings.get("feverDurationMs"), 1000, 60000, 10000),
			comboTimeoutMs: clamp(rawSettings.get("comboTimeoutMs"), 100, 10000, 1500),
			throttleMs: clamp(rawSettings.get("throttleMs"), 16, 1000, 80),

			enableStatusBar: Boolean(rawSettings.get("enableStatusBar", true)),
		});
	};

	const register = (context: vscode.ExtensionContext): void => {
		updateSettings();
		context.subscriptions.push(
			vscode.workspace.onDidChangeConfiguration((e) => {
				if (e.affectsConfiguration("sushiTheme")) updateSettings();
			}),
		);
	};

	return {
		register,
		get settings() {
			return currentConfig;
		},
	};
};
