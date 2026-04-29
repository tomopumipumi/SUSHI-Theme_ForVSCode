import type * as vscode from "vscode";

export const MAX_PARTICLES = 2000;

export class ParticleData {
	public editors: (vscode.TextEditor | undefined)[] = new Array(MAX_PARTICLES);
	public ranges: (vscode.Range | undefined)[] = new Array(MAX_PARTICLES);
	public svgUrls: string[] = new Array(MAX_PARTICLES);

	public x: Float32Array = new Float32Array(MAX_PARTICLES);
	public y: Float32Array = new Float32Array(MAX_PARTICLES);
	public vx: Float32Array = new Float32Array(MAX_PARTICLES);
	public vy: Float32Array = new Float32Array(MAX_PARTICLES);
	public rotation: Float32Array = new Float32Array(MAX_PARTICLES);

	public gravity: Float32Array = new Float32Array(MAX_PARTICLES);
	public friction: Float32Array = new Float32Array(MAX_PARTICLES);
	public rotationFactor: Float32Array = new Float32Array(MAX_PARTICLES);

	public life: Int16Array = new Int16Array(MAX_PARTICLES);
	public maxLife: Int16Array = new Int16Array(MAX_PARTICLES);

	public width: Uint16Array = new Uint16Array(MAX_PARTICLES);
	public height: Uint16Array = new Uint16Array(MAX_PARTICLES);

	public activeCount: number = 0;
}
