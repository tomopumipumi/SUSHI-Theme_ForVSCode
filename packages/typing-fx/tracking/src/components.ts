import { type IComponentData, MAX_PARTICLES } from "@typing-fx/core";

export class TrackingComponent implements IComponentData {
	public targetEntityId = new Int32Array(MAX_PARTICLES).fill(-1);

	public swapAndPop(removedIndex: number, lastIndex: number): void {
		this.targetEntityId[removedIndex] = this.targetEntityId[lastIndex];
	}
	public clear(index: number): void {
		this.targetEntityId[index] = -1;
	}
}
