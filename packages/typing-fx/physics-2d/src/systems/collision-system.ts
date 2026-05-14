import {
	COMPONENT_NAME as COMPONENT_NAME_CORE,
	MAX_PARTICLES,
	type Registry,
	type RenderComponent,
	type System,
	type TransformComponent,
} from "@typing-fx/core";
import type { ColliderComponent, PhysicsComponent } from "../components";
import { COMPONENT_NAME } from "../constants";
import type { CollisionManifold, PhysicsData, ShapeData } from "./types";
import { calculateImpulse, detectCollision } from "./utils";

export interface CollisionOptions {
	enableParticleCollision?: boolean;
	onSensorTrigger?: (sensorEntityId: number, otherEntityId: number) => void;
}

export const useCollisionSystem = (options: CollisionOptions = {}): System => {
	const s1: ShapeData = { type: 0, x: 0, y: 0, radius: 0, width: 0, height: 0, scale: 1 };
	const s2: ShapeData = { type: 0, x: 0, y: 0, radius: 0, width: 0, height: 0, scale: 1 };
	const p1: PhysicsData = {
		mass: 1,
		inertia: 0,
		restitution: 0,
		vx: 0,
		vy: 0,
		angularVelocity: 0,
		isStatic: false,
	};
	const p2: PhysicsData = {
		mass: 1,
		inertia: 0,
		restitution: 0,
		vx: 0,
		vy: 0,
		angularVelocity: 0,
		isStatic: false,
	};
	const manifold: CollisionManifold = {
		isColliding: false,
		overlap: 0,
		nx: 0,
		ny: 0,
		contactX: 0,
		contactY: 0,
	};

	const CellSize = 200;
	const HashSize = 4096;

	const head = new Int32Array(HashSize);
	const next = new Int32Array(MAX_PARTICLES);

	const getHash = (cx: number, cy: number): number => {
		return Math.abs((cx * 73856093) ^ (cy * 19349663)) % HashSize;
	};

	return (registry: Registry, _dt: number): void => {
		if (options.enableParticleCollision === false) return;

		const transform = registry.getComponent<TransformComponent>(COMPONENT_NAME_CORE.transform);
		const physics = registry.getComponent<PhysicsComponent>(COMPONENT_NAME.physics);
		const collider = registry.getComponent<ColliderComponent>(COMPONENT_NAME.collider);
		if (!transform || !physics || !collider) return;

		const RequiredMask =
			registry.getComponentMask(COMPONENT_NAME_CORE.transform) |
			registry.getComponentMask(COMPONENT_NAME.physics) |
			registry.getComponentMask(COMPONENT_NAME.collider);
		const RenderMask = registry.getComponentMask(COMPONENT_NAME_CORE.render);

		const render = registry.getComponent<RenderComponent>(COMPONENT_NAME_CORE.render);

		const iterations = 2;

		for (let iter = 0; iter < iterations; iter++) {
			head.fill(-1);

			for (let i = 0; i < registry.activeCount; i++) {
				if ((registry.entityMasks[i] & RequiredMask) !== RequiredMask) continue;

				const cx = Math.floor(transform.x[i] / CellSize);
				const cy = Math.floor(transform.y[i] / CellSize);
				const hash = getHash(cx, cy);

				next[i] = head[hash];
				head[hash] = i;
			}

			for (let i = 0; i < registry.activeCount; i++) {
				if ((registry.entityMasks[i] & RequiredMask) !== RequiredMask) continue;

				const hasRenderI = render && (registry.entityMasks[i] & RenderMask) === RenderMask;

				s1.type = collider.shapeType[i];
				s1.x = transform.x[i];
				s1.y = transform.y[i];
				s1.radius = collider.radius[i];
				s1.width = collider.width[i];
				s1.height = collider.height[i];
				s1.scale = hasRenderI ? render.currentScale[i] : 1.0;

				p1.mass = collider.mass[i];
				p1.restitution = collider.restitution[i];
				p1.vx = physics.vx[i];
				p1.vy = physics.vy[i];
				p1.isStatic = collider.isStatic[i] === 1;
				p1.mass = collider.mass[i];
				p1.inertia = collider.inertia[i];
				p1.angularVelocity = physics.angularVelocity[i];

				const cx = Math.floor(transform.x[i] / CellSize);
				const cy = Math.floor(transform.y[i] / CellSize);

				for (let dy = -1; dy <= 1; dy++) {
					for (let dx = -1; dx <= 1; dx++) {
						const hash = getHash(cx + dx, cy + dy);
						let j = head[hash];

						while (j !== -1) {
							if (j > i) {
								const hasRenderJ = render && (registry.entityMasks[j] & RenderMask) === RenderMask;

								s2.type = collider.shapeType[j];
								s2.x = transform.x[j];
								s2.y = transform.y[j];
								s2.radius = collider.radius[j];
								s2.width = collider.width[j];
								s2.height = collider.height[j];
								s2.scale = hasRenderJ ? render.currentScale[j] : 1.0;

								p2.isStatic = collider.isStatic[j] === 1;
								p2.mass = collider.mass[j];
								p2.restitution = collider.restitution[j];
								p2.vx = physics.vx[j];
								p2.vy = physics.vy[j];
								p2.inertia = collider.inertia[j];
								p2.angularVelocity = physics.angularVelocity[j];

								detectCollision(s1, s2, manifold);

								if (manifold.isColliding) {
									if (p1.isStatic && p2.isStatic) continue;

									const isSensor1 = collider.isSensor[i] === 1;
									const isSensor2 = collider.isSensor[j] === 1;

									if (isSensor1 || isSensor2) {
										if (iter === 0 && options.onSensorTrigger) {
											const id1 = registry.getEntityIdFromIndex(i);
											const id2 = registry.getEntityIdFromIndex(j);
											if (isSensor1) options.onSensorTrigger(id1, id2);
											if (isSensor2) options.onSensorTrigger(id2, id1);
										}
									} else {
										let moveRatio1 = 0;
										let moveRatio2 = 0;

										if (!p1.isStatic && !p2.isStatic) {
											const totalMass = p1.mass + p2.mass;
											moveRatio1 = p2.mass / totalMass;
											moveRatio2 = p1.mass / totalMass;
										} else if (p1.isStatic && !p2.isStatic) {
											moveRatio1 = 0;
											moveRatio2 = 1;
										} else if (!p1.isStatic && p2.isStatic) {
											moveRatio1 = 1;
											moveRatio2 = 0;
										}

										transform.x[i] -= manifold.nx * manifold.overlap * moveRatio1;
										transform.y[i] -= manifold.ny * manifold.overlap * moveRatio1;
										transform.x[j] += manifold.nx * manifold.overlap * moveRatio2;
										transform.y[j] += manifold.ny * manifold.overlap * moveRatio2;

										s1.x = transform.x[i];
										s1.y = transform.y[i];

										const { jx, jy, r1x, r1y, r2x, r2y } = calculateImpulse(
											p1,
											p2,
											manifold,
											s1,
											s2,
										);

										if (jx !== 0 || jy !== 0) {
											if (!p1.isStatic) {
												physics.vx[i] -= jx / p1.mass;
												physics.vy[i] -= jy / p1.mass;
												physics.angularVelocity[i] -= (r1x * jy - r1y * jx) / p1.inertia;

												p1.vx = physics.vx[i];
												p1.vy = physics.vy[i];
												p1.angularVelocity = physics.angularVelocity[i];
											}
											if (!p2.isStatic) {
												physics.vx[j] += jx / p2.mass;
												physics.vy[j] += jy / p2.mass;
												physics.angularVelocity[j] += (r2x * jy - r2y * jx) / p2.inertia;

												p2.vx = physics.vx[j];
												p2.vy = physics.vy[j];
												p2.angularVelocity = physics.angularVelocity[j];
											}
										}
									}
								}
							}
							j = next[j];
						}
					}
				}
			}
		}
	};
};
