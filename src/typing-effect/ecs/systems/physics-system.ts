import type { ParticleData } from "../components/particle-data";

interface PhysicsSystem {
	update: (data: ParticleData, dt: number) => void;
}

export const usePhysicsSystem = (): PhysicsSystem => {
	const update = (data: ParticleData, dt: number): void => {
		const count = data.activeCount;

		const { x, y, vx, vy, rotation, gravity, friction, rotationFactor } = data;

		for (let i = 0; i < count; i++) {
			vy[i] += gravity[i];

			vx[i] *= friction[i] ** dt;
			vy[i] *= friction[i] ** dt;

			x[i] += vx[i];
			y[i] += vy[i];

			rotation[i] += vx[i] * rotationFactor[i];
		}
	};

	return { update };
};
