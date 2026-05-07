import { COMPONENT_MASK, type Registry } from "@typing-fx/core";
import * as vscode from "vscode";

export const useRenderAdapter = () => {
	const decorationType = vscode.window.createTextEditorDecorationType({});
	const editorDecorations = new Map<vscode.TextEditor, vscode.DecorationOptions[]>();

	const updateDecorations = (registry: Registry): void => {
		for (const decos of editorDecorations.values()) decos.length = 0;

		const { components, entityMasks, activeCount } = registry;
		const { render, lifecycle, transform } = components;
		const RequiredMask =
			COMPONENT_MASK.transform | COMPONENT_MASK.render | COMPONENT_MASK.lifecycle;

		const visibleEditors = vscode.window.visibleTextEditors;

		for (let i = 0; i < activeCount; i++) {
			if ((entityMasks[i] & RequiredMask) !== RequiredMask) continue;

			const targetId = render.targetIds[i];
			const editor = visibleEditors.find((e) => e.document.uri.toString() === targetId);
			if (!editor) continue;

			const range = new vscode.Range(
				render.anchorLine[i],
				render.anchorChar[i],
				render.anchorLine[i],
				render.anchorChar[i],
			);

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
            transform:translate(${transform.x[i].toFixed(1)}px,${transform.y[i].toFixed(1)}px) rotate(${transform.rotation[i].toFixed(1)}deg) scale(${render.currentScale[i].toFixed(2)});
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

		for (const editor of editorDecorations.keys())
			if (!visibleEditors.includes(editor)) editorDecorations.delete(editor);

		for (const editor of visibleEditors) {
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

	return { updateDecorations, dispose };
};
