import * as vscode from "vscode";
import lv1 from "@/assets-svg/fever/lv1.svg";
import lv2 from "@/assets-svg/fever/lv2.svg";
import lv3 from "@/assets-svg/fever/lv3.svg";
import lv4 from "@/assets-svg/fever/lv4.svg";
import lv5 from "@/assets-svg/fever/lv5.svg";
import type { GraphicData, GraphicLevel } from "@/typing-effect/types";
import { DEFAULT_PARTICLE_MASK } from "../constants";
import type { Registry } from "../registry";

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
	registry: Registry,
	editor: vscode.TextEditor,
	position: vscode.Position,
	speedMultiplier: number = 1.0,
): void => {
	const config = vscode.workspace.getConfiguration("sushiTheme");
	const rawCount = config.get<number>("feverSpawnCount", 5);
	const baseCount = Math.max(1, Number(rawCount) || 10);
	const count = Math.floor(Math.random() * 4) + baseCount;

	const { render, transform, physics, lifecycle } = registry.components;

	for (let i = 0; i < count; i++) {
		const entity = registry.createEntity(DEFAULT_PARTICLE_MASK);
		if (entity === -1) return;

		const randomGraphic =
			FEVER_PRELOADED_SVGS[Math.floor(Math.random() * FEVER_PRELOADED_SVGS.length)];

		render.editors[entity] = editor;
		render.ranges[entity] = new vscode.Range(position, position);
		render.svgUrls[entity] = randomGraphic.svgUrl;
		render.width[entity] = randomGraphic.width;
		render.height[entity] = randomGraphic.height;

		transform.x[entity] = 0;
		transform.y[entity] = 0;
		transform.rotation[entity] = Math.random() * 360;

		physics.vx[entity] = (Math.random() - 0.5) * 30 * speedMultiplier;
		physics.vy[entity] = -(Math.random() * 20 + 10) * speedMultiplier;

		physics.gravity[entity] = 1.5;
		physics.friction[entity] = 0.95;
		physics.rotationFactor[entity] = 1.5;

		lifecycle.life[entity] = 35;
		lifecycle.maxLife[entity] = 35;
	}
};
