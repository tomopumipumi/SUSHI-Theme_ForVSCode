import * as vscode from "vscode";
import lv1 from "@/assets-svg/ikura/lv1.svg";
import lv2 from "@/assets-svg/ikura/lv2.svg";
import lv3 from "@/assets-svg/ikura/lv3.svg";
import lv4 from "@/assets-svg/ikura/lv4.svg";
import lv5 from "@/assets-svg/ikura/lv5.svg";
import type { GraphicLevel } from "@/typing-effect/types";
import { DEFAULT_PARTICLE_MASK } from "../constants";
import type { Registry } from "../registry";
import { getGraphicData } from "./graphic-loader";

const IKURA_GRAPHICS: GraphicLevel[] = [
	{ width: 10, height: 10, svgContent: lv1 },
	{ width: 16, height: 16, svgContent: lv2 },
	{ width: 20, height: 16, svgContent: lv3 },
	{ width: 24, height: 20, svgContent: lv4 },
	{ width: 24, height: 24, svgContent: lv5 },
];

export const spawnIkura = (
	registry: Registry,
	editor: vscode.TextEditor,
	position: vscode.Position,
	level: number,
	speedMultiplier: number = 1.0,
	lifeMultiplier: number = 1.0,
): void => {
	const graphic = getGraphicData(IKURA_GRAPHICS, level);
	const count = Math.floor(Math.random() * 3) + 4;
	const { render, transform, lifecycle, physics } = registry.components;

	for (let i = 0; i < count; i++) {
		const entityId = registry.createEntity(DEFAULT_PARTICLE_MASK);
		if (entityId === -1) return;

		const dataIdx = registry.getComponentIndex(entityId);
		if (dataIdx === -1) continue;

		render.editors[dataIdx] = editor;
		render.ranges[dataIdx] = new vscode.Range(position, position);
		render.svgUrls[dataIdx] = graphic.svgUrl;
		render.width[dataIdx] = graphic.width;
		render.height[dataIdx] = graphic.height;

		transform.x[dataIdx] = 0;
		transform.y[dataIdx] = 0;
		transform.rotation[dataIdx] = Math.random() * 360;

		physics.vx[dataIdx] = (Math.random() - 0.5) * 20 * speedMultiplier;
		physics.vy[dataIdx] = (Math.random() - 0.7) * 15 * speedMultiplier;

		lifecycle.life[dataIdx] = 30 * lifeMultiplier;
		lifecycle.maxLife[dataIdx] = 30 * lifeMultiplier;

		physics.gravity[dataIdx] = 1.0;
		physics.friction[dataIdx] = 0.95;
		physics.rotationFactor[dataIdx] = 0.5;
	}
};
