import {
	AnimationComponent,
	type CoreSettings,
	LifecycleComponent,
	Registry,
	RenderComponent,
	TransformComponent,
	useAnimationSystem,
	useLifecycleSystem,
	useWorld,
} from "@typing-fx/core";
import {
	ColliderComponent,
	PhysicsComponent,
	useCollisionSystem,
	usePhysicsSystem,
} from "@typing-fx/physics-2d";
import { TrackingComponent, useTrackingSystem } from "@typing-fx/tracking";
import type * as vscode from "vscode";

import { useGameSettings } from "@/game-settings";
import { useRenderAdapter } from "../adapters/render-adapter";
import { COMPONENT_NAME, type ComponentNameKey, EffectType } from "../constants";
import { useLineHighlight } from "../effects/line-highlight";
import { useParticleEffect } from "../effects/particle-effect";
import { type FeverManager, useFeverManager } from "./fever-manager";

export interface EffectManager {
	feverManager: FeverManager;
	trigger: (combo: number, position: vscode.Position, editor: vscode.TextEditor) => void;
	clearParticlesForDocument: (doc: vscode.TextDocument) => void;
	dispose: () => void;
}

export const useEffectManager = (): EffectManager => {
	const { settings } = useGameSettings();
	const lineHighlight = useLineHighlight();
	const feverManager = useFeverManager();
	const renderAdapter = useRenderAdapter();

	const feverDisposable = feverManager.onFeverStateChanged((isFever) => {
		isFever ? lineHighlight.start() : lineHighlight.stop();
	});

	const coreSettings: CoreSettings = {
		get bounceTopDistance() {
			return settings.bounceTopDistance;
		},
		get bounceBottomDistance() {
			return settings.bounceBottomDistance;
		},
		get bounceLeftDistance() {
			return settings.bounceLeftDistance;
		},
		get bounceRightDistance() {
			return settings.bounceRightDistance;
		},
		get particleSpeedMultiplier() {
			return settings.particleSpeedMultiplier;
		},
		get particleLifespanMultiplier() {
			return settings.particleLifespanMultiplier;
		},
		get enableParticleCollision() {
			return settings.enableParticleCollision;
		},
		get particleRestitution() {
			return settings.particleRestitution;
		},
	};

	const registry = new Registry<ComponentNameKey>();
	registry.registerComponent(COMPONENT_NAME.transform, new TransformComponent());
	registry.registerComponent(COMPONENT_NAME.lifecycle, new LifecycleComponent());
	registry.registerComponent(COMPONENT_NAME.render, new RenderComponent());
	registry.registerComponent(COMPONENT_NAME.animation, new AnimationComponent());
	registry.registerComponent(COMPONENT_NAME.physics, new PhysicsComponent());
	registry.registerComponent(COMPONENT_NAME.collider, new ColliderComponent());
	registry.registerComponent(COMPONENT_NAME.tracking, new TrackingComponent());

	let onExplodeCallback: (tId: string, line: number, char: number, x: number, y: number) => void =
		() => {};

	const world = useWorld({
		registry,
		get fps() {
			return settings.fps;
		},
		onRender: (reg) => renderAdapter.updateDecorations(reg),
		systems: [
			usePhysicsSystem(coreSettings),
			useCollisionSystem(coreSettings),
			useTrackingSystem({
				captureDistance: 40,
				onCapture: (id, line, char, x, y) => onExplodeCallback(id, line, char, x, y),
			}),
			useLifecycleSystem(),
			useAnimationSystem(),
		],
	});

	const particleEffect = useParticleEffect(world);
	onExplodeCallback = particleEffect.spawnExplosion;

	const trigger = (combo: number, position: vscode.Position, editor: vscode.TextEditor): void => {
		if (settings.effectType === EffectType.none) return;
		if (combo >= settings.feverTriggerCombo && !feverManager.isFever) feverManager.start();
		particleEffect.trigger(settings, feverManager.isFever, combo, position, editor);
	};

	const clearParticlesForDocument = (doc: vscode.TextDocument): void => {
		const targetId = doc.uri.toString();
		const render = registry.getComponent<RenderComponent>(COMPONENT_NAME.render);
		const lifecycle = registry.getComponent<LifecycleComponent>(COMPONENT_NAME.lifecycle);
		if (!render || !lifecycle) return;

		const RequiredMask =
			registry.getComponentMask(COMPONENT_NAME.render) |
			registry.getComponentMask(COMPONENT_NAME.lifecycle);

		let needsCleanup = false;
		for (let i = 0; i < registry.activeCount; i++)
			if ((registry.entityMasks[i] & RequiredMask) === RequiredMask)
				if (render.targetIds[i] === targetId) {
					lifecycle.life[i] = 0;
					needsCleanup = true;
				}
		if (needsCleanup) world.startLoop();
	};

	const dispose = (): void => {
		world.dispose();
		renderAdapter.dispose();
		lineHighlight.dispose();
		feverManager.dispose();
		feverDisposable.dispose();
		particleEffect.dispose();
	};

	return { feverManager, trigger, clearParticlesForDocument, dispose };
};
