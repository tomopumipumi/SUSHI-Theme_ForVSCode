import chopsticksSvg from "@/assets-svg/chopsticks/lv1.svg";
import type { ParticleProfile } from "@/typing-effect/types";
import { getLevelData } from "../utils";

export const useChopsticksProfile = (): ParticleProfile => {
	const svgs = [chopsticksSvg];
	const sizes = [{ w: 50, h: 50 }];

	return {
		graphic: getLevelData(1, svgs, sizes),
		count: 1,
		vxRange: [0, 0],
		vyRange: [0, 0],
		gravity: 0,
		friction: 0.95,
		rotationFactor: 0,
		baseLife: 100,
		spawnSpreadX: [-50, 50],
		spawnSpreadY: [-50, -50],
		isTracking: true,
	};
};
