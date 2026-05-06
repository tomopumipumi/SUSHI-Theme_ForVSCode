import * as vscode from "vscode";
import { COMPONENT_MASK } from "../constants";
import type { Registry } from "../registry";

interface RenderSystem {
	update: (registry: Registry) => void;
	dispose: () => void;
}

export const useRenderSystem = (): RenderSystem => {
	const decorationType = vscode.window.createTextEditorDecorationType({});

	const editorDecorations = new Map<vscode.TextEditor, vscode.DecorationOptions[]>();

	const RequiredMask = COMPONENT_MASK.transform | COMPONENT_MASK.render | COMPONENT_MASK.lifecycle;

	const update = (registry: Registry): void => {
		for (const decos of editorDecorations.values()) decos.length = 0;

		const { components, entityMasks, activeCount } = registry;
		const { render, lifecycle, transform } = components;

		for (let i = 0; i < activeCount; i++) {
			if ((entityMasks[i] & RequiredMask) !== RequiredMask) continue;

			const editor = render.editors[i];
			const range = render.ranges[i];
			if (!editor || !range) continue;

			const opacity = Math.max(0, lifecycle.life[i] / lifecycle.maxLife[i]);

			const style = `
			none;
			position:absolute;
			display:inline-block;
			width:${render.width[i]}px;
			height:${render.height[i]}px;
			background-image:${render.svgUrls[i]};
			background-size:contain;
			background-repeat:no-repeat;
			transform:translate(${transform.x[i].toFixed(1)}px,${transform.y[i].toFixed(1)}px) rotate(${transform.rotation[i].toFixed(1)}deg);
			opacity:${opacity.toFixed(2)};
			pointer-events:none;
			z-index:999;
			`;

			const decoration: vscode.DecorationOptions = {
				range: range,
				renderOptions: {
					before: { contentText: "", textDecoration: style },
				},
			};

			let decos = editorDecorations.get(editor);
			if (!decos) {
				decos = [];
				editorDecorations.set(editor, decos);
			}
			decos.push(decoration);
		}

		const visibleEditors = vscode.window.visibleTextEditors;
		for (const editor of editorDecorations.keys()) {
			if (!visibleEditors.includes(editor)) {
				editorDecorations.delete(editor);
			}
		}
		for (const editor of vscode.window.visibleTextEditors) {
			const decos = editorDecorations.get(editor) || [];
			editor.setDecorations(decorationType, decos);
		}
	};

	const dispose = (): void => {
		for (const editor of vscode.window.visibleTextEditors)
			editor.setDecorations(decorationType, []);
		decorationType.dispose();
		editorDecorations.clear();
	};

	return { update, dispose };
};
