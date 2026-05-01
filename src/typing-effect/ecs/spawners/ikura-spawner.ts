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
): void => {
	const graphic = getGraphicData(IKURA_GRAPHICS, level);
	const count = Math.floor(Math.random() * 3) + 4;
	const { render, transform, lifecycle, physics } = registry.components;

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

		physics.vx[entity] = (Math.random() - 0.5) * 20 * speedMultiplier;
		physics.vy[entity] = (Math.random() - 0.7) * 15 * speedMultiplier;

		lifecycle.life[entity] = 30;
		lifecycle.maxLife[entity] = 30;

		physics.gravity[entity] = 1.0;
		physics.friction[entity] = 0.95;
		physics.rotationFactor[entity] = 0.5;
	}
};
