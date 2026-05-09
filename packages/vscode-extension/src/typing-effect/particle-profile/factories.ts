import { EffectType } from "../constants";
import type { EffectTypeKey } from "../types";
import {
	getEbiProfile,
	getIkuraProfile,
	getMaguroProfile,
	getMatchaProfile,
} from "./profiles/theme-profile";

export const createParticleProfile = (targetType: EffectTypeKey, level: number) => {
	switch (targetType) {
		case EffectType.maguro:
			return getMaguroProfile(level);

		case EffectType.ikura:
			return getIkuraProfile(level);

		case EffectType.ebi:
			return getEbiProfile(level);

		case EffectType.matcha:
			return getMatchaProfile(level);

		default:
			return getMaguroProfile(level);
	}
};
