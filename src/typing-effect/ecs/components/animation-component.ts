import type { GraphicData } from "../../types";
import { MAX_PARTICLES } from "../constants";

export class AnimationComponent {
	public frames: (GraphicData[] | undefined)[] = new Array(MAX_PARTICLES);
}
