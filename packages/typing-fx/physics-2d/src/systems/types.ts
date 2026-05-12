export interface ShapeData {
	type: number;
	x: number;
	y: number;
	radius: number;
	width: number;
	height: number;
	scale: number;
}

export interface PhysicsData {
	mass: number;
	restitution: number;
	vx: number;
	vy: number;
}

export interface CollisionManifold {
	isColliding: boolean;
	overlap: number;
	nx: number;
	ny: number;
}
