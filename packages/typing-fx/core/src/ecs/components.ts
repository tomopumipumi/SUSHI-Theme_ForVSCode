import type { GraphicData } from "../types";
import { MAX_PARTICLES } from "./constants";
import type { IComponentData } from "./registry";

export class TransformComponent implements IComponentData {
	public x = new Float32Array(MAX_PARTICLES);
	public y = new Float32Array(MAX_PARTICLES);
	public rotation = new Float32Array(MAX_PARTICLES);

	public baseX = new Float32Array(MAX_PARTICLES);
	public baseY = new Float32Array(MAX_PARTICLES);

	public swapAndPop(removedIndex: number, lastIndex: number): void {
		this.x[removedIndex] = this.x[lastIndex];
		this.y[removedIndex] = this.y[lastIndex];
		this.rotation[removedIndex] = this.rotation[lastIndex];
		this.baseX[removedIndex] = this.baseX[lastIndex];
		this.baseY[removedIndex] = this.baseY[lastIndex];
	}
	public clear(index: number): void {
		this.x[index] = 0;
		this.y[index] = 0;
		this.rotation[index] = 0;
		this.baseX[index] = 0;
		this.baseY[index] = 0;
	}
}

export class LifecycleComponent implements IComponentData {
	public life = new Float32Array(MAX_PARTICLES);
	public maxLife = new Float32Array(MAX_PARTICLES);

	public swapAndPop(removedIndex: number, lastIndex: number): void {
		this.life[removedIndex] = this.life[lastIndex];
		this.maxLife[removedIndex] = this.maxLife[lastIndex];
	}
	public clear(index: number): void {
		this.life[index] = 0;
		this.maxLife[index] = 0;
	}
}

export class RenderComponent implements IComponentData {
	public targetIds: string[] = new Array(MAX_PARTICLES).fill("");
	public anchorLine = new Uint32Array(MAX_PARTICLES);
	public anchorChar = new Uint32Array(MAX_PARTICLES);
	public svgUrls: string[] = new Array(MAX_PARTICLES).fill("");
	public width = new Uint16Array(MAX_PARTICLES);
	public height = new Uint16Array(MAX_PARTICLES);
	public initialScale = new Float32Array(MAX_PARTICLES).fill(1.0);
	public targetScale = new Float32Array(MAX_PARTICLES).fill(1.0);
	public currentScale = new Float32Array(MAX_PARTICLES).fill(1.0);

	public swapAndPop(removedIndex: number, lastIndex: number): void {
		this.targetIds[removedIndex] = this.targetIds[lastIndex];
		this.anchorLine[removedIndex] = this.anchorLine[lastIndex];
		this.anchorChar[removedIndex] = this.anchorChar[lastIndex];
		this.svgUrls[removedIndex] = this.svgUrls[lastIndex];
		this.width[removedIndex] = this.width[lastIndex];
		this.height[removedIndex] = this.height[lastIndex];
		this.initialScale[removedIndex] = this.initialScale[lastIndex];
		this.targetScale[removedIndex] = this.targetScale[lastIndex];
		this.currentScale[removedIndex] = this.currentScale[lastIndex];
	}
	public clear(index: number): void {
		this.targetIds[index] = "";
		this.anchorLine[index] = 0;
		this.anchorChar[index] = 0;
		this.svgUrls[index] = "";
		this.width[index] = 0;
		this.height[index] = 0;
		this.initialScale[index] = 1.0;
		this.targetScale[index] = 1.0;
		this.currentScale[index] = 1.0;
	}
}

export class AnimationComponent implements IComponentData {
	public frames: (GraphicData[] | undefined)[] = new Array(MAX_PARTICLES);

	public swapAndPop(removedIndex: number, lastIndex: number): void {
		this.frames[removedIndex] = this.frames[lastIndex];
	}
	public clear(index: number): void {
		this.frames[index] = undefined;
	}
}
