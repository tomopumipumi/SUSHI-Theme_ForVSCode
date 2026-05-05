import type * as vscode from "vscode";
import { COMPONENT_MASK } from "../constants";
import type { Registry } from "../registry";

const INVALID_TARGET_ID = -1;
const TARGET_LOST_GRAVITY = 1.5;
const CAPTURE_DISTANCE = 20;
const TRACKING_SPEED = 5.0;
const TRACKING_GRAVITY = 0;

export const useTrackingSystem = () => {
	const RequiredMask =
		COMPONENT_MASK.transform |
		COMPONENT_MASK.physics |
		COMPONENT_MASK.targeting |
		COMPONENT_MASK.render;

	const update = (
		registry: Registry,
		dt: number,
		onExplode: (editor: vscode.TextEditor, range: vscode.Range, x: number, y: number) => void,
	) => {
		const { components, entityMasks, activeCount } = registry;
		const { transform, physics, targeting, render } = components;

		for (let i = 0; i < activeCount; i++) {
			if ((entityMasks[i] & RequiredMask) !== RequiredMask) continue;

			const targetId = targeting.targetEntityId[i];

			if (!registry.isValid(targetId)) {
				targeting.targetEntityId[i] = INVALID_TARGET_ID;
				physics.gravity[i] = TARGET_LOST_GRAVITY;
				continue;
			}

			const targetIdx = registry.getComponentIndex(targetId);

			const dx = transform.x[targetIdx] - transform.x[i];
			const dy = transform.y[targetIdx] - transform.y[i];
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < CAPTURE_DISTANCE) {
				const editor = render.editors[i];
				const range = render.ranges[i];

				if (editor && range) onExplode(editor, range, transform.x[i], transform.y[i]);

				registry.destroyEntity(registry.getEntityIdFromIndex(i));
				registry.destroyEntity(targetId);
				continue;
			}

			physics.vx[i] += (dx / distance) * TRACKING_SPEED * dt;
			physics.vy[i] += (dy / distance) * TRACKING_SPEED * dt;

			physics.gravity[i] = TRACKING_GRAVITY;
		}
	};

	return { update };
};
