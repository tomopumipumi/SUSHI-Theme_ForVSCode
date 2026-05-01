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
		const entity = registry.createEntity(DEFAULT_PARTICLE_MASK);
		if (entity === -1) return;

		render.editors[entity] = editor;
		render.ranges[entity] = new vscode.Range(position, position);
		render.svgUrls[entity] = graphic.svgUrl;
		render.width[entity] = graphic.width;
		render.height[entity] = graphic.height;

		transform.x[entity] = 0;
		transform.y[entity] = 0;
		transform.rotation[entity] = Math.random() * 360;

		physics.vx[entity] = (Math.random() - 0.5) * 15 * speedMultiplier;
		physics.vy[entity] = -(Math.random() * 15 + 10) * speedMultiplier;

		lifecycle.life[entity] = 20;
		lifecycle.maxLife[entity] = 20;

		physics.gravity[entity] = 1.2;
		physics.friction[entity] = 0.98;
		physics.rotationFactor[entity] = 1.5;
	}
};
