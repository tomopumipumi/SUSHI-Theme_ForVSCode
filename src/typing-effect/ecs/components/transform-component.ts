import { MAX_PARTICLES } from "../constants";

export class TransformComponent {
	public x = new Float32Array(MAX_PARTICLES);
	public y = new Float32Array(MAX_PARTICLES);
	public rotation = new Float32Array(MAX_PARTICLES);
}
