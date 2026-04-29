import * as vscode from "vscode";
import lv1 from "@/assets-svg/matcha/lv1.svg";
import lv2 from "@/assets-svg/matcha/lv2.svg";
import lv3 from "@/assets-svg/matcha/lv3.svg";
import lv4 from "@/assets-svg/matcha/lv4.svg";
import lv5 from "@/assets-svg/matcha/lv5.svg";
import type { GraphicLevel } from "@/typing-effect/types";
import { MAX_PARTICLES, type ParticleData } from "../components/particle-data";
import { getGraphicData } from "./utils";

const MATCHA_GRAPHICS: GraphicLevel[] = [
	{ width: 12, height: 12, svgContent: lv1 },
	{ width: 16, height: 16, svgContent: lv2 },
	{ width: 20, height: 22, svgContent: lv3 },
	{ width: 20, height: 22, svgContent: lv4 },
	{ width: 20, height: 28, svgContent: lv5 },
];

export const spawnMatcha = (
	data: ParticleData,
	editor: vscode.TextEditor,
	position: vscode.Position,
	level: number,
): void => {
	const graphic = getGraphicData(MATCHA_GRAPHICS, level);
	const count = Math.floor(Math.random() * 2) + 1;

	for (let i = 0; i < count; i++) {
		if (data.activeCount >= MAX_PARTICLES) return;
		const idx = data.activeCount;

		data.editors[idx] = editor;
		data.ranges[idx] = new vscode.Range(position, position);
		data.svgUrls[idx] = graphic.svgUrl;
		data.width[idx] = graphic.width;
		data.height[idx] = graphic.height;
		data.x[idx] = 0;
		data.y[idx] = 0;
		data.rotation[idx] = Math.random() * 360;

		data.vx[idx] = (Math.random() - 0.5) * 5;
		data.vy[idx] = -(Math.random() * 3 + 2);
		data.life[idx] = 30;
		data.maxLife[idx] = 30;

		data.gravity[idx] = -0.5;
		data.friction[idx] = 0.9;
		data.rotationFactor[idx] = 1.0;

		data.activeCount++;
	}
};
