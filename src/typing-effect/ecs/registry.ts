import {
	LifecycleComponent,
	PhysicsComponent,
	RenderComponent,
	TransformComponent,
} from "./components";
import { COMPONENT_MASK, MAX_PARTICLES } from "./constants";

export class Registry {
	public activeCount: number = 0;
	public entityMasks: Uint32Array = new Uint32Array(MAX_PARTICLES);

	public components = {
		transform: new TransformComponent(),
		physics: new PhysicsComponent(),
		render: new RenderComponent(),
		lifecycle: new LifecycleComponent(),
	};

	public createEntity(mask: number): number {
		if (this.activeCount >= MAX_PARTICLES) return -1;
		const entity = this.activeCount;
		this.entityMasks[entity] = mask;
		this.activeCount++;
		return entity;
	}

	public destroyEntity(entity: number): void {
		const last = this.activeCount - 1;
		const { components, entityMasks } = this;
		const { transform, physics, render, lifecycle } = components;

		if (entity !== last) {
			entityMasks[entity] = entityMasks[last];

			transform.x[entity] = transform.x[last];
			transform.y[entity] = transform.y[last];
			transform.rotation[entity] = transform.rotation[last];

			physics.vx[entity] = physics.vx[last];
			physics.vy[entity] = physics.vy[last];
			physics.gravity[entity] = physics.gravity[last];
			physics.friction[entity] = physics.friction[last];
			physics.rotationFactor[entity] = physics.rotationFactor[last];

			render.editors[entity] = render.editors[last];
			render.ranges[entity] = render.ranges[last];
			render.svgUrls[entity] = render.svgUrls[last];
			render.width[entity] = render.width[last];
			render.height[entity] = render.height[last];

			lifecycle.life[entity] = lifecycle.life[last];
			lifecycle.maxLife[entity] = lifecycle.maxLife[last];
		}

		entityMasks[last] = COMPONENT_MASK.none;
		render.editors[last] = undefined;
		render.ranges[last] = undefined;
		render.svgUrls[last] = "";

		this.activeCount--;
	}
}
