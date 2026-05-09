import type { GraphicData } from "../types";

const createSvgUrl = (svgContent: string): string => {
	const encoded = encodeURIComponent(svgContent.trim());
	return `url("data:image/svg+xml;charset=utf-8,${encoded}")`;
};

export const getLevelData = (
	level: number,
	svgs: string[],
	sizes: { w: number; h: number }[],
): GraphicData => {
	const index = level - 1;
	return {
		width: sizes[index].w,
		height: sizes[index].h,
		svgUrl: createSvgUrl(svgs[index]),
	};
};
