import * as vscode from "vscode";
import lv1 from "@/assets-svg/fever/lv1.svg";
import lv2 from "@/assets-svg/fever/lv2.svg";
import lv3 from "@/assets-svg/fever/lv3.svg";
import lv4 from "@/assets-svg/fever/lv4.svg";
import lv5 from "@/assets-svg/fever/lv5.svg";
import type { GraphicData, GraphicLevel } from "@/typing-effect/types";
import { MAX_PARTICLES, type ParticleData } from "../components/particle-data";

const FEVER_GRAPHICS: GraphicLevel[] = [
	{ width: 24, height: 18, svgContent: lv1 },
	{ width: 24, height: 24, svgContent: lv2 },
	{ width: 26, height: 18, svgContent: lv3 },
	{ width: 24, height: 18, svgContent: lv4 },
	{ width: 24, height: 20, svgContent: lv5 },
];

const FEVER_PRELOADED_SVGS: GraphicData[] = FEVER_GRAPHICS.map((g) => {
	const w = g.width + 10;
	const h = g.height + 10;

	const svgData = encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 ${w} ${h}" width="${w}" height="${h}">
            <filter id="feverGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#FFD700" flood-opacity="0.9"/>
            </filter>
            <g filter="url(#feverGlow)">
                ${g.svgContent}
            </g>
        </svg>`,
	);
	return {
		width: w,
		height: h,
		svgUrl: `url("data:image/svg+xml;charset=utf-8,${svgData}")`,
	};
});

export const spawnFever = (
	data: ParticleData,
	editor: vscode.TextEditor,
	position: vscode.Position,
): void => {
	const config = vscode.workspace.getConfiguration("sushiTheme");
	const rawCount = config.get<number>("feverSpawnCount", 5);
	const baseCount = Math.max(1, Number(rawCount) || 10);
	const count = Math.floor(Math.random() * 4) + baseCount;

	for (let i = 0; i < count; i++) {
		if (data.activeCount >= MAX_PARTICLES) return;
		const idx = data.activeCount;

		const randomGraphic =
			FEVER_PRELOADED_SVGS[Math.floor(Math.random() * FEVER_PRELOADED_SVGS.length)];

		data.editors[idx] = editor;
		data.ranges[idx] = new vscode.Range(position, position);
		data.svgUrls[idx] = randomGraphic.svgUrl;
		data.width[idx] = randomGraphic.width;
		data.height[idx] = randomGraphic.height;
		data.x[idx] = 0;
		data.y[idx] = 0;
		data.rotation[idx] = Math.random() * 360;

		data.vx[idx] = (Math.random() - 0.5) * 30;
		data.vy[idx] = -(Math.random() * 20 + 10);
		data.life[idx] = 35;
		data.maxLife[idx] = 35;

		data.gravity[idx] = 1.5;
		data.friction[idx] = 0.95;
		data.rotationFactor[idx] = 1.5;

		data.activeCount++;
	}
};
