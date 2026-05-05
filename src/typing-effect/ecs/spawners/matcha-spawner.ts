import * as vscode from "vscode";
import lv1 from "@/assets-svg/matcha/lv1.svg";
import lv2 from "@/assets-svg/matcha/lv2.svg";
import lv3 from "@/assets-svg/matcha/lv3.svg";
import lv4 from "@/assets-svg/matcha/lv4.svg";
import lv5 from "@/assets-svg/matcha/lv5.svg";
import type { GraphicLevel } from "@/typing-effect/types";
import { DEFAULT_PARTICLE_MASK } from "../constants";
import type { Registry } from "../registry";
import { getGraphicData } from "./graphic-loader";

const MATCHA_GRAPHICS: GraphicLevel[] = [
	{ width: 12, height: 12, svgContent: lv1 },
	{ width: 16, height: 16, svgContent: lv2 },
	{ width: 20, height: 22, svgContent: lv3 },
	{ width: 20, height: 22, svgContent: lv4 },
	{ width: 20, height: 28, svgContent: lv5 },
];

export const spawnMatcha = (
	registry: Registry,
	editor: vscode.TextEditor,
	position: vscode.Position,
	level: number,
	speedMultiplier: number = 1.0,
): void => {
	const graphic = getGraphicData(MATCHA_GRAPHICS, level);
	const count = Math.floor(Math.random() * 2) + 1;
	const { render, transform, physics, lifecycle } = registry.components;

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

		physics.vx[dataIdx] = (Math.random() - 0.5) * 5 * speedMultiplier;
		physics.vy[dataIdx] = -(Math.random() * 3 + 2) * speedMultiplier;

		lifecycle.life[dataIdx] = 30;
		lifecycle.maxLife[dataIdx] = 30;

		physics.gravity[dataIdx] = -0.5;
		physics.friction[dataIdx] = 0.9;
		physics.rotationFactor[dataIdx] = 1.0;
	}
};
