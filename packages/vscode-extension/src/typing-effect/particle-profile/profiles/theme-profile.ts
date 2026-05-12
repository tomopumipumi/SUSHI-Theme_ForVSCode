import ebiLv1 from "@/assets-svg/ebi/lv1.svg";
import ebiLv2 from "@/assets-svg/ebi/lv2.svg";
import ebiLv3 from "@/assets-svg/ebi/lv3.svg";
import ebiLv4 from "@/assets-svg/ebi/lv4.svg";
import ebiLv5 from "@/assets-svg/ebi/lv5.svg";
import ikuraLv1 from "@/assets-svg/ikura/lv1.svg";
import ikuraLv2 from "@/assets-svg/ikura/lv2.svg";
import ikuraLv3 from "@/assets-svg/ikura/lv3.svg";
import ikuraLv4 from "@/assets-svg/ikura/lv4.svg";
import ikuraLv5 from "@/assets-svg/ikura/lv5.svg";
import maguroLv1 from "@/assets-svg/maguro/lv1.svg";
import maguroLv2 from "@/assets-svg/maguro/lv2.svg";
import maguroLv3 from "@/assets-svg/maguro/lv3.svg";
import maguroLv4 from "@/assets-svg/maguro/lv4.svg";
import maguroLv5 from "@/assets-svg/maguro/lv5.svg";
import matchaLv1 from "@/assets-svg/matcha/lv1.svg";
import matchaLv2 from "@/assets-svg/matcha/lv2.svg";
import matchaLv3 from "@/assets-svg/matcha/lv3.svg";
import matchaLv4 from "@/assets-svg/matcha/lv4.svg";
import matchaLv5 from "@/assets-svg/matcha/lv5.svg";
import type { ParticleProfile } from "@/typing-effect/types";
import { getLevelData } from "../utils";

export const useMaguroProfile = (level: number): ParticleProfile => {
	const svgs = [maguroLv1, maguroLv2, maguroLv3, maguroLv4, maguroLv5];
	const sizes = [
		{ w: 10, h: 16 },
		{ w: 16, h: 16 },
		{ w: 20, h: 14 },
		{ w: 20, h: 16 },
		{ w: 24, h: 18 },
	];

	return {
		graphic: getLevelData(level, svgs, sizes),
		count: Math.floor(Math.random() * 2) + 2,
		vxRange: [-7.5, 7.5],
		vyRange: [-15, -5],
		gravity: 1.0,
		friction: 1.0,
		rotationFactor: 1.0,
		baseLife: 20,
	};
};

export const useIkuraProfile = (level: number): ParticleProfile => {
	const svgs = [ikuraLv1, ikuraLv2, ikuraLv3, ikuraLv4, ikuraLv5];
	const sizes = [
		{ w: 10, h: 10 },
		{ w: 16, h: 16 },
		{ w: 20, h: 16 },
		{ w: 24, h: 20 },
		{ w: 24, h: 24 },
	];

	return {
		graphic: getLevelData(level, svgs, sizes),
		count: Math.floor(Math.random() * 3) + 4,
		vxRange: [-10, 10],
		vyRange: [-10, 5],
		gravity: 1.0,
		friction: 0.95,
		rotationFactor: 0.5,
		baseLife: 30,
	};
};

export const useEbiProfile = (level: number): ParticleProfile => {
	const svgs = [ebiLv1, ebiLv2, ebiLv3, ebiLv4, ebiLv5];
	const sizes = [
		{ w: 12, h: 12 },
		{ w: 18, h: 12 },
		{ w: 24, h: 14 },
		{ w: 24, h: 16 },
		{ w: 26, h: 18 },
	];

	return {
		graphic: getLevelData(level, svgs, sizes),
		count: Math.floor(Math.random() * 2) + 2,
		vxRange: [-7.5, 7.5],
		vyRange: [-25, -10],
		gravity: 1.2,
		friction: 0.98,
		rotationFactor: 1.5,
		baseLife: 20,
	};
};

export const useMatchaProfile = (level: number): ParticleProfile => {
	const svgs = [matchaLv1, matchaLv2, matchaLv3, matchaLv4, matchaLv5];
	const sizes = [
		{ w: 12, h: 12 },
		{ w: 16, h: 16 },
		{ w: 20, h: 22 },
		{ w: 20, h: 22 },
		{ w: 20, h: 28 },
	];

	return {
		graphic: getLevelData(level, svgs, sizes),
		count: Math.floor(Math.random() * 2) + 1,
		vxRange: [-2.5, 2.5],
		vyRange: [-5, -2],
		gravity: -0.5,
		friction: 0.9,
		rotationFactor: 1.0,
		baseLife: 30,
	};
};
