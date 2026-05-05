import { MAX_PARTICLES } from "../constants";

export class TargetingComponent {
	public targetEntityId = new Int32Array(MAX_PARTICLES).fill(-1);
}
