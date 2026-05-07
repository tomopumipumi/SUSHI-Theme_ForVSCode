import {
	AnimationComponent,
	LifecycleComponent,
	PhysicsComponent,
	RenderComponent,
	TargetingComponent,
	TransformComponent,
} from "./components";
import { COMPONENT_MASK, MAX_PARTICLES } from "./constants";

const INDEX_MASK = 0xffff;
const GENERATION_SHIFT = 16;

export class Registry {
	public activeCount: number = 0;
	public entityMasks: Uint32Array = new Uint32Array(MAX_PARTICLES);

	private generations = new Uint16Array(MAX_PARTICLES);
	private freeIndices: number[] = [];

	private sparse = new Int32Array(MAX_PARTICLES).fill(-1);
	private dense = new Int32Array(MAX_PARTICLES).fill(-1);

	public components = {
		transform: new TransformComponent(),
		physics: new PhysicsComponent(),
		render: new RenderComponent(),
		lifecycle: new LifecycleComponent(),
		targeting: new TargetingComponent(),
		animation: new AnimationComponent(),
	};

	public createEntity(mask: number): number {
		if (this.activeCount >= MAX_PARTICLES) return -1;

		const index = this.freeIndices.pop() ?? this.activeCount;
		const generation = this.generations[index];
		const entityId = (generation << GENERATION_SHIFT) | index;

		const denseIndex = this.activeCount;
		this.sparse[index] = denseIndex;
		this.dense[denseIndex] = index;

		this.entityMasks[denseIndex] = mask;
		this.activeCount++;

		return entityId;
	}

	public destroyEntity(entityId: number): void {
		if (!this.isValid(entityId)) return;

		const index = entityId & INDEX_MASK;
		const denseIndex = this.sparse[index];
		const lastDenseIndex = this.activeCount - 1;

		const { components, entityMasks } = this;
		const { transform, physics, render, lifecycle, targeting, animation } = components;

		if (denseIndex !== lastDenseIndex) {
			const lastIndex = this.dense[lastDenseIndex];
			entityMasks[denseIndex] = entityMasks[lastDenseIndex];

			transform.x[denseIndex] = transform.x[lastDenseIndex];
			transform.y[denseIndex] = transform.y[lastDenseIndex];
			transform.rotation[denseIndex] = transform.rotation[lastDenseIndex];

			physics.vx[denseIndex] = physics.vx[lastDenseIndex];
			physics.vy[denseIndex] = physics.vy[lastDenseIndex];
			physics.gravity[denseIndex] = physics.gravity[lastDenseIndex];
			physics.friction[denseIndex] = physics.friction[lastDenseIndex];
			physics.rotationFactor[denseIndex] = physics.rotationFactor[lastDenseIndex];

			render.targetIds[denseIndex] = render.targetIds[lastDenseIndex];
			render.anchorLine[denseIndex] = render.anchorLine[lastDenseIndex];
			render.anchorChar[denseIndex] = render.anchorChar[lastDenseIndex];
			render.svgUrls[denseIndex] = render.svgUrls[lastDenseIndex];
			render.width[denseIndex] = render.width[lastDenseIndex];
			render.height[denseIndex] = render.height[lastDenseIndex];
			render.initialScale[denseIndex] = render.initialScale[lastDenseIndex];
			render.targetScale[denseIndex] = render.targetScale[lastDenseIndex];
			render.currentScale[denseIndex] = render.currentScale[lastDenseIndex];

			lifecycle.life[denseIndex] = lifecycle.life[lastDenseIndex];
			lifecycle.maxLife[denseIndex] = lifecycle.maxLife[lastDenseIndex];

			targeting.targetEntityId[denseIndex] = targeting.targetEntityId[lastDenseIndex];
			animation.frames[denseIndex] = animation.frames[lastDenseIndex];

			this.dense[denseIndex] = lastIndex;
			this.sparse[lastIndex] = denseIndex;
		}

		entityMasks[lastDenseIndex] = COMPONENT_MASK.none;
		render.targetIds[lastDenseIndex] = "";
		render.anchorLine[lastDenseIndex] = 0;
		render.anchorChar[lastDenseIndex] = 0;
		render.svgUrls[lastDenseIndex] = "";
		render.initialScale[lastDenseIndex] = 1.0;
		render.targetScale[lastDenseIndex] = 1.0;
		render.currentScale[lastDenseIndex] = 1.0;
		animation.frames[lastDenseIndex] = undefined;

		this.activeCount--;
		this.generations[index]++;
		this.sparse[index] = -1;
		this.dense[lastDenseIndex] = -1;
		this.freeIndices.push(index);
	}

	public isValid(entityId: number): boolean {
		const index = entityId & INDEX_MASK;
		const generation = entityId >>> GENERATION_SHIFT;
		return (
			index >= 0 &&
			index < MAX_PARTICLES &&
			this.generations[index] === generation &&
			this.sparse[index] !== -1
		);
	}

	public getRandomAliveEntityId(): number {
		if (this.activeCount === 0) return -1;
		const randomDenseIndex = Math.floor(Math.random() * this.activeCount);
		return this.getEntityIdFromIndex(randomDenseIndex);
	}

	public getComponentIndex(entityId: number): number {
		if (!this.isValid(entityId)) return -1;
		return this.sparse[entityId & INDEX_MASK];
	}

	public getEntityIdFromIndex(denseIndex: number): number {
		if (denseIndex < 0 || denseIndex >= this.activeCount) return -1;
		const index = this.dense[denseIndex];
		const generation = this.generations[index];
		return (generation << GENERATION_SHIFT) | index;
	}
}
