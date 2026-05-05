import type * as vscode from "vscode";
import lv1 from "@/assets-svg/explosion/lv1.svg";
import lv2 from "@/assets-svg/explosion/lv2.svg";
import lv3 from "@/assets-svg/explosion/lv3.svg";
import lv4 from "@/assets-svg/explosion/lv4.svg";
import lv5 from "@/assets-svg/explosion/lv5.svg";
import type { GraphicData, GraphicLevel } from "@/typing-effect/types";
import { COMPONENT_MASK } from "../constants";
import type { Registry } from "../registry";
import { getGraphicData } from "./graphic-loader";

const EXPLOSION_GRAPHICS: GraphicLevel[] = [
	{ width: 20, height: 20, svgContent: lv1 },
	{ width: 50, height: 50, svgContent: lv2 },
	{ width: 100, height: 100, svgContent: lv3 },
	{ width: 80, height: 80, svgContent: lv4 },
	{ width: 110, height: 110, svgContent: lv5 },
];

const EXPLOSION_FRAMES: GraphicData[] = EXPLOSION_GRAPHICS.map((_, index) =>
	getGraphicData(EXPLOSION_GRAPHICS, index + 1),
);

export const spawnExplosion = (
	registry: Registry,
	editor: vscode.TextEditor,
	range: vscode.Range,
	x: number,
	y: number,
): void => {
	const mask =
		COMPONENT_MASK.transform |
		COMPONENT_MASK.physics |
		COMPONENT_MASK.render |
		COMPONENT_MASK.lifecycle |
		COMPONENT_MASK.animation;

	const entityId = registry.createEntity(mask);
	if (entityId === -1) return;

	const dataIdx = registry.getComponentIndex(entityId);
	if (dataIdx === -1) return;

	const graphic = getGraphicData(EXPLOSION_GRAPHICS, 1);

	const { render, transform, physics, lifecycle, animation } = registry.components;

	render.editors[dataIdx] = editor;
	render.ranges[dataIdx] = range;

	render.svgUrls[dataIdx] = graphic.svgUrl;
	render.width[dataIdx] = graphic.width;
	render.height[dataIdx] = graphic.height;

	transform.x[dataIdx] = x;
	transform.y[dataIdx] = y;
	transform.rotation[dataIdx] = (Math.random() - 0.5) * 45;

	physics.vx[dataIdx] = 0;
	physics.vy[dataIdx] = -1;
	physics.gravity[dataIdx] = 0;
	physics.friction[dataIdx] = 0.9;
	physics.rotationFactor[dataIdx] = 0;

	lifecycle.life[dataIdx] = 20;
	lifecycle.maxLife[dataIdx] = 20;

	animation.frames[dataIdx] = EXPLOSION_FRAMES;
};
