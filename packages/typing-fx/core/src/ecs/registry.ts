import { MAX_PARTICLES } from "./constants";

const INDEX_MASK = 0xffff;
const GENERATION_SHIFT = 16;

export interface IComponentData {
	swapAndPop: (removedIndex: number, lastIndex: number) => void;
	clear: (index: number) => void;
}

export class Registry<ComponentNameType extends string = string> {
	public activeCount: number = 0;
	public entityMasks: Uint32Array = new Uint32Array(MAX_PARTICLES);

	public components: Record<string, IComponentData> = {};
	private componentMasks: Record<string, number> = {};
	private nextComponentBit = 1;

	private generations = new Uint16Array(MAX_PARTICLES);
	private freeIndices: number[] = [];

	private sparse = new Int32Array(MAX_PARTICLES).fill(-1);
	private dense = new Int32Array(MAX_PARTICLES).fill(-1);

	public registerComponent(name: ComponentNameType, data: IComponentData): number {
		this.components[name] = data;
		const mask = this.nextComponentBit;
		this.componentMasks[name] = mask;
		this.nextComponentBit <<= 1;
		return mask;
	}

	public getComponentMask(name: ComponentNameType): number {
		return this.componentMasks[name] || 0;
	}

	public getComponent<T extends IComponentData>(name: ComponentNameType): T | undefined {
		return this.components[name] as T | undefined;
	}

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

		const { entityMasks } = this;

		if (denseIndex !== lastDenseIndex) {
			const lastIndex = this.dense[lastDenseIndex];
			entityMasks[denseIndex] = entityMasks[lastDenseIndex];

			for (const key in this.components)
				this.components[key].swapAndPop(denseIndex, lastDenseIndex);

			this.dense[denseIndex] = lastIndex;
			this.sparse[lastIndex] = denseIndex;
		}

		entityMasks[lastDenseIndex] = 0;
		for (const key in this.components) this.components[key].clear(lastDenseIndex);

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
