import { MAX_PARTICLES } from "../constants";

export class LifecycleComponent {
	public life = new Int16Array(MAX_PARTICLES);
	public maxLife = new Int16Array(MAX_PARTICLES);
}
