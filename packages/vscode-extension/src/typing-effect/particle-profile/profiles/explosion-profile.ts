import type { ParticleProfile } from "@typing-fx/core";
import explosionLv1 from "@/assets-svg/explosion/lv1.svg";
import explosionLv2 from "@/assets-svg/explosion/lv2.svg";
import explosionLv3 from "@/assets-svg/explosion/lv3.svg";
import explosionLv4 from "@/assets-svg/explosion/lv4.svg";
import explosionLv5 from "@/assets-svg/explosion/lv5.svg";
import { getLevelData } from "../utils";

export const getExplosionProfile = (level: number = 1): ParticleProfile => {
	const svgs = [explosionLv1, explosionLv2, explosionLv3, explosionLv4, explosionLv5];
	const sizes = [
		{ w: 50, h: 50 },
		{ w: 100, h: 100 },
		{ w: 300, h: 300 },
		{ w: 150, h: 150 },
		{ w: 500, h: 500 },
	];

	return {
		graphic: getLevelData(level, svgs, sizes),
		count: 1,
		vxRange: [0, 0],
		vyRange: [0, 0],
		gravity: 0,
		friction: 1.0,
		rotationFactor: 0,
		initialRotationRange: [0, 360],
		initialScaleRange: [0.5, 0.8],
		targetScale: 1.5,
		baseLife: 15,
	};
};
