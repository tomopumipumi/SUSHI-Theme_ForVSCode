import type { GraphicData, ParticleProfile } from "@typing-fx/core";
import feverLv1 from "@/assets-svg/fever/lv1.svg";
import feverLv2 from "@/assets-svg/fever/lv2.svg";
import feverLv3 from "@/assets-svg/fever/lv3.svg";
import feverLv4 from "@/assets-svg/fever/lv4.svg";
import feverLv5 from "@/assets-svg/fever/lv5.svg";

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

export const getFeverProfile = (spawnCount: number): ParticleProfile => {
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
