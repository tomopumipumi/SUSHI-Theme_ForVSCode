import { ShapeType } from "../components";
import type { CollisionManifold, PhysicsData, ShapeData } from "./types";

export const detectCollision = (s1: ShapeData, s2: ShapeData, out: CollisionManifold): void => {
	out.isColliding = false;

	if (s1.type === ShapeType.circle && s2.type === ShapeType.circle) {
		const r1 = s1.radius * s1.scale;
		const r2 = s2.radius * s2.scale;
		const dx = s2.x - s1.x;
		const dy = s2.y - s1.y;
		const distSq = dx * dx + dy * dy;
		const minDist = r1 + r2;

		if (distSq < minDist * minDist) {
			out.isColliding = true;
			const dist = Math.sqrt(distSq);
			if (dist > 0) {
				out.overlap = minDist - dist;
				out.nx = dx / dist;
				out.ny = dy / dist;
			} else {
				out.overlap = minDist;
				out.nx = 1;
				out.ny = 0;
			}
		}
	} else if (s1.type !== s2.type) {
		const isCircleFirst = s1.type === ShapeType.circle;
		const circle = isCircleFirst ? s1 : s2;
		const box = isCircleFirst ? s2 : s1;

		const r = circle.radius * circle.scale;
		const hw = (box.width * box.scale) / 2;
		const hh = (box.height * box.scale) / 2;

		const px = Math.max(box.x - hw, Math.min(circle.x, box.x + hw));
		const py = Math.max(box.y - hh, Math.min(circle.y, box.y + hh));

		const dx = circle.x - px;
		const dy = circle.y - py;
		const distSq = dx * dx + dy * dy;

		if (distSq < r * r) {
			out.isColliding = true;
			const dist = Math.sqrt(distSq);
			if (dist > 0) {
				out.overlap = r - dist;
				out.nx = (isCircleFirst ? -dx : dx) / dist;
				out.ny = (isCircleFirst ? -dy : dy) / dist;
			} else {
				out.overlap = r;
				out.nx = 0;
				out.ny = isCircleFirst ? -1 : 1;
			}
		}
	}
};

export const calculateImpulse = (
	p1: PhysicsData,
	p2: PhysicsData,
	manifold: CollisionManifold,
): { jx: number; jy: number } => {
	const dvx = p2.vx - p1.vx;
	const dvy = p2.vy - p1.vy;
	const velAlongNormal = dvx * manifold.nx + dvy * manifold.ny;

	if (velAlongNormal > 0) return { jx: 0, jy: 0 };

	const invMass1 = p1.isStatic ? 0 : 1 / p1.mass;
	const invMass2 = p2.isStatic ? 0 : 1 / p2.mass;
	const invMassSum = invMass1 + invMass2;

	if (invMassSum === 0) return { jx: 0, jy: 0 };

	const restitution = Math.min(p1.restitution, p2.restitution);
	const j = (-(1 + restitution) * velAlongNormal) / invMassSum;

	let jx = j * manifold.nx;
	let jy = j * manifold.ny;

	let tx = dvx - velAlongNormal * manifold.nx;
	let ty = dvy - velAlongNormal * manifold.ny;
	const tLen = Math.sqrt(tx * tx + ty * ty);

	if (tLen > 0.0001) {
		tx /= tLen;
		ty /= tLen;
		const velAlongTangent = dvx * tx + dvy * ty;

		let jt = -velAlongTangent / invMassSum;

		const mu = 0.8;

		if (Math.abs(jt) > j * mu) jt = j * mu * Math.sign(jt);

		jx += jt * tx;
		jy += jt * ty;
	}

	return { jx, jy };
};
