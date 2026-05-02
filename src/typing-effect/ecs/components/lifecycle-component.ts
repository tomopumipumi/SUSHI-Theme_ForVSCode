import { MAX_PARTICLES } from "../constants";

export class LifecycleComponent {
	public life = new Float32Array(MAX_PARTICLES);
	public maxLife = new Float32Array(MAX_PARTICLES);
}
