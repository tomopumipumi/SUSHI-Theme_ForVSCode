import * as vscode from "vscode";
import type { ParticleData } from "../components/particle-data";

interface RenderSystem {
	update: (data: ParticleData) => void;
	dispose: () => void;
}

export const useRenderSystem = (): RenderSystem => {
	const decorationType = vscode.window.createTextEditorDecorationType({});

	const editorDecorations = new Map<vscode.TextEditor, vscode.DecorationOptions[]>();

	const update = (data: ParticleData): void => {
		for (const decos of editorDecorations.values()) decos.length = 0;

		const { x, y, rotation, life, maxLife, width, height, svgUrls, editors, ranges } = data;
		const count = data.activeCount;

		for (let i = 0; i < count; i++) {
			const editor = editors[i];
			const range = ranges[i];
			if (!editor || !range) continue;

			const opacity = Math.max(0, life[i] / maxLife[i]);

			const style = `none;position:absolute;display:inline-block;width:${width[i]}px;height:${height[i]}px;background-image:${svgUrls[i]};background-size:contain;background-repeat:no-repeat;transform:translate(${x[i].toFixed(1)}px, ${y[i].toFixed(1)}px) rotate(${rotation[i].toFixed(1)}deg);opacity:${opacity.toFixed(2)};pointer-events:none;z-index:999;`;

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

		for (const editor of vscode.window.visibleTextEditors) {
			const decos = editorDecorations.get(editor) || [];
			editor.setDecorations(decorationType, decos);
		}
	};

	const dispose = (): void => {
		for (const editor of vscode.window.visibleTextEditors)
			editor.setDecorations(decorationType, []);
		decorationType.dispose();
	};

	return { update, dispose };
};
