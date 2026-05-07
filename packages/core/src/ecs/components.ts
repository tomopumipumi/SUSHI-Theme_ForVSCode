import type { GraphicData } from "../types";
import { MAX_PARTICLES } from "./constants";

export class AnimationComponent {
	public frames: (GraphicData[] | undefined)[] = new Array(MAX_PARTICLES);
}

export class LifecycleComponent {
	public life = new Float32Array(MAX_PARTICLES);
	public maxLife = new Float32Array(MAX_PARTICLES);
}

export class PhysicsComponent {
	public vx = new Float32Array(MAX_PARTICLES);
	public vy = new Float32Array(MAX_PARTICLES);
	public gravity = new Float32Array(MAX_PARTICLES);
	public friction = new Float32Array(MAX_PARTICLES);
	public rotationFactor = new Float32Array(MAX_PARTICLES);
}

export class RenderComponent {
	public targetIds: string[] = new Array(MAX_PARTICLES).fill("");
	public anchorLine = new Uint32Array(MAX_PARTICLES);
	public anchorChar = new Uint32Array(MAX_PARTICLES);

	public svgUrls: string[] = new Array(MAX_PARTICLES).fill("");
	public width = new Uint16Array(MAX_PARTICLES);
	public height = new Uint16Array(MAX_PARTICLES);

	public initialScale = new Float32Array(MAX_PARTICLES).fill(1.0);
	public targetScale = new Float32Array(MAX_PARTICLES).fill(1.0);
	public currentScale = new Float32Array(MAX_PARTICLES).fill(1.0);
}

export class TargetingComponent {
	public targetEntityId = new Int32Array(MAX_PARTICLES).fill(-1);
}

export class TransformComponent {
	public x = new Float32Array(MAX_PARTICLES);
	public y = new Float32Array(MAX_PARTICLES);
	public rotation = new Float32Array(MAX_PARTICLES);
}
