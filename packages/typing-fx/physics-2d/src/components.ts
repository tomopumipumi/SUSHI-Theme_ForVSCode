import { type IComponentData, MAX_PARTICLES } from "@typing-fx/core";

export const ShapeType = {
	circle: 0,
	box: 1,
} as const;

export class PhysicsComponent implements IComponentData {
	public vx = new Float32Array(MAX_PARTICLES);
	public vy = new Float32Array(MAX_PARTICLES);

	public fx = new Float32Array(MAX_PARTICLES);
	public fy = new Float32Array(MAX_PARTICLES);

	public gravity = new Float32Array(MAX_PARTICLES);
	public friction = new Float32Array(MAX_PARTICLES);
	public rotationFactor = new Float32Array(MAX_PARTICLES);

	public ignoreGravity = new Uint8Array(MAX_PARTICLES);

	public swapAndPop(removedIndex: number, lastIndex: number): void {
		this.vx[removedIndex] = this.vx[lastIndex];
		this.vy[removedIndex] = this.vy[lastIndex];
		this.fx[removedIndex] = this.fx[lastIndex];
		this.fy[removedIndex] = this.fy[lastIndex];
		this.gravity[removedIndex] = this.gravity[lastIndex];
		this.friction[removedIndex] = this.friction[lastIndex];
		this.rotationFactor[removedIndex] = this.rotationFactor[lastIndex];
		this.ignoreGravity[removedIndex] = this.ignoreGravity[lastIndex];
	}

	public clear(index: number): void {
		this.vx[index] = 0;
		this.vy[index] = 0;
		this.fx[index] = 0;
		this.fy[index] = 0;
		this.gravity[index] = 0;
		this.friction[index] = 1.0;
		this.rotationFactor[index] = 0;
		this.ignoreGravity[index] = 0;
	}
}

export class ColliderComponent implements IComponentData {
	public shapeType = new Uint8Array(MAX_PARTICLES).fill(ShapeType.circle);
	public isSensor = new Uint8Array(MAX_PARTICLES).fill(0);
	public isStatic = new Uint8Array(MAX_PARTICLES).fill(0);

	public radius = new Float32Array(MAX_PARTICLES);
	public width = new Float32Array(MAX_PARTICLES);
	public height = new Float32Array(MAX_PARTICLES);

	public mass = new Float32Array(MAX_PARTICLES).fill(1.0);
	public restitution = new Float32Array(MAX_PARTICLES).fill(0.8);

	public swapAndPop(removedIndex: number, lastIndex: number): void {
		this.shapeType[removedIndex] = this.shapeType[lastIndex];
		this.isSensor[removedIndex] = this.isSensor[lastIndex];
		this.isStatic[removedIndex] = this.isStatic[lastIndex];
		this.radius[removedIndex] = this.radius[lastIndex];
		this.width[removedIndex] = this.width[lastIndex];
		this.height[removedIndex] = this.height[lastIndex];
		this.mass[removedIndex] = this.mass[lastIndex];
		this.restitution[removedIndex] = this.restitution[lastIndex];
	}

	public clear(index: number): void {
		this.shapeType[index] = ShapeType.circle;
		this.isSensor[index] = 0;
		this.isStatic[index] = 0;
		this.radius[index] = 0;
		this.width[index] = 0;
		this.height[index] = 0;
		this.mass[index] = 1.0;
		this.restitution[index] = 0.8;
	}
}
