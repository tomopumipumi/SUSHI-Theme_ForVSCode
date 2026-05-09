import type { ParticleProfile, World } from "@typing-fx/core";
import type * as vscode from "vscode";
import type { SushiSettings } from "@/game-settings";
import { EffectType, RANDOM_POOL } from "../constants";
import {
	createParticleProfile,
	getChopsticksProfile,
	getExplosionProfile,
	getFeverProfile,
} from "../particle-profile";
import type { EffectTypeKey } from "../types";

export interface ParticleEffect {
	spawnExplosion: (
		targetId: string,
		anchorLine: number,
		anchorChar: number,
		x: number,
		y: number,
	) => void;
	trigger: (
		settings: SushiSettings,
		isFever: boolean,
		combo: number,
		position: vscode.Position,
		editor: vscode.TextEditor,
	) => void;
	dispose: () => void;
}

export const useParticleEffect = (world: World): ParticleEffect => {
	let activeRandomType: EffectTypeKey = EffectType.maguro;
	const activeTimeouts = new Set<NodeJS.Timeout>();

	const spawnExplosion = (
		targetId: string,
		anchorLine: number,
		anchorChar: number,
		x: number,
		y: number,
	): void => {
		const randomLevel = Math.floor(Math.random() * 5) + 1;
		const explodeProfile = getExplosionProfile(randomLevel);

		explodeProfile.spawnSpreadX = [x, x];
		explodeProfile.spawnSpreadY = [y, y];

		world.spawn(explodeProfile, targetId, anchorLine, anchorChar);
	};

	const trigger = (
		settings: SushiSettings,
		isFever: boolean,
		combo: number,
		position: vscode.Position,
		editor: vscode.TextEditor,
	): void => {
		const rawLevel = Math.floor(combo / settings.comboUnit) + 1;
		const safeLevel = Math.min(rawLevel, 5);

		const targetId = editor.document.uri.toString();
		const anchorLine = position.line;
		const anchorChar = position.character;

		let profile: ParticleProfile;

		if (isFever) {
			profile = getFeverProfile(settings.feverSpawnCount);
		} else {
			let targetType: EffectTypeKey = settings.effectType;

			if (targetType === EffectType.random) {
				if (combo === 1) {
					const randIndex = Math.floor(Math.random() * RANDOM_POOL.length);
					activeRandomType = RANDOM_POOL[randIndex];
				}
				targetType = activeRandomType;
			}

			profile = createParticleProfile(targetType, safeLevel);
		}

		world.spawn(profile, targetId, anchorLine, anchorChar);

		if (Math.random() < 0.05) {
			const targetEntityId = world.getRandomAliveEntityId();
			if (targetEntityId !== -1) {
				const t = setTimeout(() => {
					activeTimeouts.delete(t);
					world.spawn(getChopsticksProfile(), targetId, anchorLine, anchorChar, targetEntityId);
				}, 400);
				activeTimeouts.add(t);
			}
		}
	};

	const dispose = (): void => {
		for (const t of activeTimeouts) clearTimeout(t);
		activeTimeouts.clear();
	};

	return { spawnExplosion, trigger, dispose };
};
