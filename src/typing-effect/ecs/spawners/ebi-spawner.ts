import * as vscode from "vscode";
import lv1 from "@/assets-svg/ebi/lv1.svg";
import lv2 from "@/assets-svg/ebi/lv2.svg";
import lv3 from "@/assets-svg/ebi/lv3.svg";
import lv4 from "@/assets-svg/ebi/lv4.svg";
import lv5 from "@/assets-svg/ebi/lv5.svg";
import type { GraphicLevel } from "@/typing-effect/types";
import { DEFAULT_PARTICLE_MASK } from "../constants";
import type { Registry } from "../registry";
import { getGraphicData } from "./graphic-loader";

const EBI_GRAPHICS: GraphicLevel[] = [
	{ width: 12, height: 12, svgContent: lv1 },
	{ width: 18, height: 12, svgContent: lv2 },
	{ width: 24, height: 14, svgContent: lv3 },
	{ width: 24, height: 16, svgContent: lv4 },
	{ width: 26, height: 18, svgContent: lv5 },
];

export const spawnEbi = (
	registry: Registry,
	editor: vscode.TextEditor,
	position: vscode.Position,
	level: number,
	speedMultiplier: number = 1.0,
): void => {
	const graphic = getGraphicData(EBI_GRAPHICS, level);
	const count = Math.floor(Math.random() * 2) + 2;
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

		physics.vx[dataIdx] = (Math.random() - 0.5) * 15 * speedMultiplier;
		physics.vy[dataIdx] = -(Math.random() * 15 + 10) * speedMultiplier;

		lifecycle.life[dataIdx] = 20;
		lifecycle.maxLife[dataIdx] = 20;

		physics.gravity[dataIdx] = 1.2;
		physics.friction[dataIdx] = 0.98;
		physics.rotationFactor[dataIdx] = 1.5;
	}
};
