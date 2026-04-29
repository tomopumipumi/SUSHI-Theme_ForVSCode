import type { ParticleData } from "../components/particle-data";

interface LifecycleSystem {
	update: (data: ParticleData) => void;
}

export const useLifecycleSystem = (): LifecycleSystem => {
	const update = (data: ParticleData): void => {
		for (let i = data.activeCount - 1; i >= 0; i--) {
			data.life[i] -= 1;

			if (data.life[i] <= 0) {
				removeParticle(data, i);
			}
		}
	};

	const removeParticle = (data: ParticleData, index: number): void => {
		const last = data.activeCount - 1;

		if (index !== last) {
			data.editors[index] = data.editors[last];
			data.ranges[index] = data.ranges[last];
			data.svgUrls[index] = data.svgUrls[last];

			data.x[index] = data.x[last];
			data.y[index] = data.y[last];
			data.vx[index] = data.vx[last];
			data.vy[index] = data.vy[last];
			data.rotation[index] = data.rotation[last];

			data.life[index] = data.life[last];
			data.maxLife[index] = data.maxLife[last];

			data.width[index] = data.width[last];
			data.height[index] = data.height[last];

			data.gravity[index] = data.gravity[last];
			data.friction[index] = data.friction[last];
			data.rotationFactor[index] = data.rotationFactor[last];
		}

		data.editors[last] = undefined;
		data.ranges[last] = undefined;
		data.svgUrls[last] = "";

		data.activeCount--;
	};

	return { update };
};
