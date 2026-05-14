import type {
	LifecycleComponent,
	Registry,
	RenderComponent,
	TransformComponent,
} from "@typing-fx/core";
import * as vscode from "vscode";
import { COMPONENT_NAME } from "../constants";

const defaultCSS =
	"none;position:absolute;display:inline-block;background-size:contain;background-repeat:no-repeat;pointer-events:none;z-index:999;";

export interface RenderAdapter {
	updateDecorations: (registry: Registry) => void;
	dispose: () => void;
}

export const useRenderAdapter = (): RenderAdapter => {
	const decorationType = vscode.window.createTextEditorDecorationType({});
	const editorDecorations = new Map<vscode.TextEditor, vscode.DecorationOptions[]>();

	const updateDecorations = (registry: Registry): void => {
		for (const decos of editorDecorations.values()) decos.length = 0;

		const render = registry.getComponent<RenderComponent>(COMPONENT_NAME.render);
		const lifecycle = registry.getComponent<LifecycleComponent>(COMPONENT_NAME.lifecycle);
		const transform = registry.getComponent<TransformComponent>(COMPONENT_NAME.transform);

		if (!render || !lifecycle || !transform) return;

		const { entityMasks, activeCount } = registry;
		const RequiredMask =
			registry.getComponentMask(COMPONENT_NAME.transform) |
			registry.getComponentMask(COMPONENT_NAME.render) |
			registry.getComponentMask(COMPONENT_NAME.lifecycle);

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

			const translateX = transform.x[i] - transform.baseX[i];
			const translateY = transform.y[i] - transform.baseY[i];

			const style = `
			${defaultCSS}
            width:${render.width[i]}px;
            height:${render.height[i]}px;
            background-image:${render.svgUrls[i]};
           	transform:translate(${translateX.toFixed(1)}px,${translateY.toFixed(1)}px) rotate(${transform.rotation[i].toFixed(1)}deg) scale(${render.currentScale[i].toFixed(2)});
            opacity:${opacity.toFixed(2)};
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

		for (const editor of editorDecorations.keys()) {
			if (!visibleEditors.includes(editor)) {
				editor.setDecorations(decorationType, []);
				editorDecorations.delete(editor);
			}
		}

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
