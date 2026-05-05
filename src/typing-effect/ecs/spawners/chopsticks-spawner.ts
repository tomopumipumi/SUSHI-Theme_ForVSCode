import * as vscode from "vscode";
import chopsticksSvg from "@/assets-svg/chopsticks/lv1.svg";
import type { GraphicLevel } from "@/typing-effect/types";
import { COMPONENT_MASK } from "../constants";
import type { Registry } from "../registry";
import { getGraphicData } from "./graphic-loader";

const CHOPSTICKS_GRAPHICS: GraphicLevel[] = [{ width: 50, height: 50, svgContent: chopsticksSvg }];

export const spawnChopsticks = (
	registry: Registry,
	editor: vscode.TextEditor,
	position: vscode.Position,
	targetId: number,
): void => {
	const mask =
		COMPONENT_MASK.transform |
		COMPONENT_MASK.physics |
		COMPONENT_MASK.render |
		COMPONENT_MASK.lifecycle |
		COMPONENT_MASK.targeting;

	const entityId = registry.createEntity(mask);
	if (entityId === -1) return;

	const dataIdx = registry.getComponentIndex(entityId);
	if (dataIdx === -1) return;

	const graphic = getGraphicData(CHOPSTICKS_GRAPHICS, 1);

	const { render, transform, physics, lifecycle, targeting } = registry.components;

	render.editors[dataIdx] = editor;
	render.ranges[dataIdx] = new vscode.Range(position, position);

	render.svgUrls[dataIdx] = graphic.svgUrl;
	render.width[dataIdx] = graphic.width;
	render.height[dataIdx] = graphic.height;

	transform.x[dataIdx] = (Math.random() - 0.5) * 100;
	transform.y[dataIdx] = -50;
	transform.rotation[dataIdx] = 0;

	physics.vx[dataIdx] = 0;
	physics.vy[dataIdx] = 0;
	physics.gravity[dataIdx] = 0;
	physics.friction[dataIdx] = 0.95;
	physics.rotationFactor[dataIdx] = 0;

	lifecycle.life[dataIdx] = 100;
	lifecycle.maxLife[dataIdx] = 100;

	targeting.targetEntityId[dataIdx] = targetId;
};
