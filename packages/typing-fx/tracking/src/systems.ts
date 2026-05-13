import type {
	LifecycleComponent,
	Registry,
	RenderComponent,
	System,
	TransformComponent,
} from "@typing-fx/core";
import { COMPONENT_NAME as COMPONENT_NAME_CORE } from "@typing-fx/core";
import type { PhysicsComponent } from "@typing-fx/physics-2d";
import { COMPONENT_NAME as COMPONENT_NAME_PHYSICS2D } from "@typing-fx/physics-2d";
import type { TrackingComponent } from "./components";
import { COMPONENT_NAME } from "./constants";

export interface TrackingOptions {
	captureDistance?: number;
	onCapture?: (targetId: string, line: number, char: number, x: number, y: number) => void;
}

const INVALID_TARGET_ID = -1;

export const useTrackingSystem = (options: TrackingOptions = {}): System => {
	const captureDist = options.captureDistance || 20;

	return (registry: Registry, _dt: number) => {
		const tracking = registry.getComponent<TrackingComponent>(COMPONENT_NAME.tracking);
		const transform = registry.getComponent<TransformComponent>(COMPONENT_NAME_CORE.transform);
		const physics = registry.getComponent<PhysicsComponent>(COMPONENT_NAME_PHYSICS2D.physics);
		const lifecycle = registry.getComponent<LifecycleComponent>(COMPONENT_NAME_CORE.lifecycle);
		const render = registry.getComponent<RenderComponent>(COMPONENT_NAME_CORE.render);

		if (!tracking || !transform || !physics) return;

		const RequiredMask =
			registry.getComponentMask(COMPONENT_NAME.tracking) |
			registry.getComponentMask(COMPONENT_NAME_CORE.transform) |
			registry.getComponentMask(COMPONENT_NAME_PHYSICS2D.physics);

		for (let i = registry.activeCount - 1; i >= 0; i--) {
			if ((registry.entityMasks[i] & RequiredMask) !== RequiredMask) continue;

			const targetId = tracking.targetEntityId[i];

			if (targetId === INVALID_TARGET_ID) continue;

			if (!registry.isValid(targetId)) {
				tracking.targetEntityId[i] = INVALID_TARGET_ID;
				physics.ignoreGravity[i] = 0;
				continue;
			}

			const targetIdx = registry.getComponentIndex(targetId);
			const dx = transform.x[targetIdx] - transform.x[i];
			const dy = transform.y[targetIdx] - transform.y[i];
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < captureDist) {
				if (options.onCapture && render) {
					const tId = render.targetIds[i];
					const line = render.anchorLine[i];
					const char = render.anchorChar[i];

					const relX = transform.x[i] - transform.baseX[i];
					const relY = transform.y[i] - transform.baseY[i];
					options.onCapture(tId, line, char, relX, relY);
				}

				if (lifecycle) {
					lifecycle.life[i] = 0;
					lifecycle.life[targetIdx] = 0;
				}
				continue;
			}

			const trackingForce = 5.0;
			physics.fx[i] += (dx / distance) * trackingForce;
			physics.fy[i] += (dy / distance) * trackingForce;

			physics.ignoreGravity[i] = 1;
		}
	};
};
