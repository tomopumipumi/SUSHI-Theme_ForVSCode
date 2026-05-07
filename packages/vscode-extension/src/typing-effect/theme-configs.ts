import type { GraphicData, ParticleThemeConfig } from "@typing-fx/core";
import chopsticksSvg from "@/assets-svg/chopsticks/lv1.svg";
import ebiLv1 from "@/assets-svg/ebi/lv1.svg";
import ebiLv2 from "@/assets-svg/ebi/lv2.svg";
import ebiLv3 from "@/assets-svg/ebi/lv3.svg";
import ebiLv4 from "@/assets-svg/ebi/lv4.svg";
import ebiLv5 from "@/assets-svg/ebi/lv5.svg";
import explosionLv1 from "@/assets-svg/explosion/lv1.svg";
import explosionLv2 from "@/assets-svg/explosion/lv2.svg";
import explosionLv3 from "@/assets-svg/explosion/lv3.svg";
import explosionLv4 from "@/assets-svg/explosion/lv4.svg";
import explosionLv5 from "@/assets-svg/explosion/lv5.svg";
import feverLv1 from "@/assets-svg/fever/lv1.svg";
import feverLv2 from "@/assets-svg/fever/lv2.svg";
import feverLv3 from "@/assets-svg/fever/lv3.svg";
import feverLv4 from "@/assets-svg/fever/lv4.svg";
import feverLv5 from "@/assets-svg/fever/lv5.svg";
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

const createSvgUrl = (svgContent: string): string => {
	const encoded = encodeURIComponent(svgContent.trim());
	return `url("data:image/svg+xml;charset=utf-8,${encoded}")`;
};

const createFeverGlowSvgUrl = (svgContent: string, width: number, height: number): GraphicData => {
	const w = width + 10;
	const h = height + 10;
	const svgData = encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 ${w} ${h}" width="${w}" height="${h}">
            <filter id="feverGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#FFD700" flood-opacity="0.9"/>
            </filter>
            <g filter="url(#feverGlow)">
                ${svgContent}
            </g>
        </svg>`,
	);
	return {
		width: w,
		height: h,
		svgUrl: `url("data:image/svg+xml;charset=utf-8,${svgData}")`,
	};
};

const getLevelData = (
	level: number,
	svgs: string[],
	sizes: { w: number; h: number }[],
): GraphicData => {
	const safeLevel = Math.max(1, Math.min(level, 5));
	const index = safeLevel - 1;
	return {
		width: sizes[index].w,
		height: sizes[index].h,
		svgUrl: createSvgUrl(svgs[index]),
	};
};

export const getMaguroConfig = (level: number): ParticleThemeConfig => {
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

export const getIkuraConfig = (level: number): ParticleThemeConfig => {
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

export const getEbiConfig = (level: number): ParticleThemeConfig => {
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

export const getMatchaConfig = (level: number): ParticleThemeConfig => {
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

export const getFeverConfig = (spawnCount: number): ParticleThemeConfig => {
	const svgs = [feverLv1, feverLv2, feverLv3, feverLv4, feverLv5];
	const sizes = [
		{ w: 24, h: 18 },
		{ w: 24, h: 24 },
		{ w: 26, h: 18 },
		{ w: 24, h: 18 },
		{ w: 24, h: 20 },
	];

	const graphics = svgs.map((svg, index) =>
		createFeverGlowSvgUrl(svg, sizes[index].w, sizes[index].h),
	);

	return {
		graphic: graphics,
		count: spawnCount,
		vxRange: [-15, 15],
		vyRange: [-30, -10],
		gravity: 1.5,
		friction: 0.95,
		rotationFactor: 1.5,
		baseLife: 35,
	};
};

export const getChopsticksConfig = (): ParticleThemeConfig => {
	return {
		graphic: {
			width: 50,
			height: 50,
			svgUrl: createSvgUrl(chopsticksSvg),
		},
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

export const getExplosionConfig = (level: number = 1): ParticleThemeConfig => {
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
