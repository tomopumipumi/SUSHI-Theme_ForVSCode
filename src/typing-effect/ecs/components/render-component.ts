import type * as vscode from "vscode";
import { MAX_PARTICLES } from "../constants";

export class RenderComponent {
	public editors: (vscode.TextEditor | undefined)[] = new Array(MAX_PARTICLES);
	public ranges: (vscode.Range | undefined)[] = new Array(MAX_PARTICLES);
	public svgUrls: string[] = new Array(MAX_PARTICLES);
	public width = new Uint16Array(MAX_PARTICLES);
	public height = new Uint16Array(MAX_PARTICLES);
}
