import { MAX_PARTICLES } from "../constants";

export class PhysicsComponent {
	public vx = new Float32Array(MAX_PARTICLES);
	public vy = new Float32Array(MAX_PARTICLES);
	public gravity = new Float32Array(MAX_PARTICLES);
	public friction = new Float32Array(MAX_PARTICLES);
	public rotationFactor = new Float32Array(MAX_PARTICLES);
}
