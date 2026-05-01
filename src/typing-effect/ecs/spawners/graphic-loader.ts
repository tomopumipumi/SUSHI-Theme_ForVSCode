import type { GraphicData, GraphicLevel } from "@/typing-effect/types";

export const getGraphicData = (levels: GraphicLevel[], level: number): GraphicData => {
	const maxLevel = 5;
	const safeLevel = Math.min(Math.max(level, 1), maxLevel);

	const { width, height, svgContent } = levels[safeLevel - 1];

	const svgData = encodeURIComponent(svgContent.trim());

	return {
		width,
		height,
		svgUrl: `url("data:image/svg+xml;charset=utf-8,${svgData}")`,
	};
};
