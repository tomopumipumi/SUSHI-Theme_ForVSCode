import * as vscode from "vscode";
import lv1 from "@/assets-svg/ebi/lv1.svg";
import lv2 from "@/assets-svg/ebi/lv2.svg";
import lv3 from "@/assets-svg/ebi/lv3.svg";
import lv4 from "@/assets-svg/ebi/lv4.svg";
import lv5 from "@/assets-svg/ebi/lv5.svg";
import type { GraphicLevel } from "@/typing-effect/types";
import { MAX_PARTICLES, type ParticleData } from "../components/particle-data";
import { getGraphicData } from "./utils";

const EBI_GRAPHICS: GraphicLevel[] = [
	{ width: 12, height: 12, svgContent: lv1 },
	{ width: 18, height: 12, svgContent: lv2 },
	{ width: 24, height: 14, svgContent: lv3 },
	{ width: 24, height: 16, svgContent: lv4 },
	{ width: 26, height: 18, svgContent: lv5 },
];

export const spawnEbi = (
	data: ParticleData,
	editor: vscode.TextEditor,
	position: vscode.Position,
	level: number,
): void => {
	const graphic = getGraphicData(EBI_GRAPHICS, level);
	const count = Math.floor(Math.random() * 2) + 2;

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

		data.vx[idx] = (Math.random() - 0.5) * 15;
		data.vy[idx] = -(Math.random() * 15 + 10);
		data.life[idx] = 20;
		data.maxLife[idx] = 20;

		data.gravity[idx] = 1.2;
		data.friction[idx] = 0.98;
		data.rotationFactor[idx] = 1.5;

		data.activeCount++;
	}
};
