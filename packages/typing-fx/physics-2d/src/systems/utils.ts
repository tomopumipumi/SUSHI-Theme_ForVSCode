import { ShapeType } from "../components";
import type { CollisionManifold, PhysicsData, ShapeData } from "./types";

export const detectCollision = (s1: ShapeData, s2: ShapeData, out: CollisionManifold): void => {
	out.isColliding = false;
	out.contactX = 0;
	out.contactY = 0;

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
			out.contactX = s1.x + out.nx * r1;
			out.contactY = s1.y + out.ny * r1;
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
			out.contactX = px;
			out.contactY = py;
		}
	}
};

export const calculateImpulse = (
	p1: PhysicsData,
	p2: PhysicsData,
	manifold: CollisionManifold,
	s1: ShapeData,
	s2: ShapeData,
): { jx: number; jy: number; r1x: number; r1y: number; r2x: number; r2y: number } => {
	const r1x = manifold.contactX - s1.x;
	const r1y = manifold.contactY - s1.y;
	const r2x = manifold.contactX - s2.x;
	const r2y = manifold.contactY - s2.y;

	const v1x = p1.vx - p1.angularVelocity * r1y;
	const v1y = p1.vy + p1.angularVelocity * r1x;
	const v2x = p2.vx - p2.angularVelocity * r2y;
	const v2y = p2.vy + p2.angularVelocity * r2x;

	const dvx = v2x - v1x;
	const dvy = v2y - v1y;

	const velAlongNormal = dvx * manifold.nx + dvy * manifold.ny;

	if (velAlongNormal > 0) return { jx: 0, jy: 0, r1x: 0, r1y: 0, r2x: 0, r2y: 0 };

	const invMass1 = p1.isStatic ? 0 : 1 / p1.mass;
	const invMass2 = p2.isStatic ? 0 : 1 / p2.mass;
	const invInertia1 = p1.isStatic ? 0 : 1 / p1.inertia;
	const invInertia2 = p2.isStatic ? 0 : 1 / p2.inertia;

	const r1CrossN = r1x * manifold.ny - r1y * manifold.nx;
	const r2CrossN = r2x * manifold.ny - r2y * manifold.nx;

	const invMassSum =
		invMass1 + invMass2 + r1CrossN * r1CrossN * invInertia1 + r2CrossN * r2CrossN * invInertia2;

	if (invMassSum === 0) return { jx: 0, jy: 0, r1x: 0, r1y: 0, r2x: 0, r2y: 0 };

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

		const r1CrossT = r1x * ty - r1y * tx;
		const r2CrossT = r2x * ty - r2y * tx;

		const invMassSumT =
			invMass1 + invMass2 + r1CrossT * r1CrossT * invInertia1 + r2CrossT * r2CrossT * invInertia2;

		let jt = -velAlongTangent / invMassSumT;
		const mu = 0.5;

		if (Math.abs(jt) > j * mu) jt = j * mu * Math.sign(jt);

		jx += jt * tx;
		jy += jt * ty;
	}

	return { jx, jy, r1x, r1y, r2x, r2y };
};
