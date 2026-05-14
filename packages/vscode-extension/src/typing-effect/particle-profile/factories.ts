import { EffectType } from "../constants";
import type { EffectTypeKey } from "../types";
import {
	useEbiProfile,
	useIkuraProfile,
	useMaguroProfile,
	useMatchaProfile,
} from "./profiles/sushi-profile";

export const createParticleProfile = (targetType: EffectTypeKey, level: number) => {
	switch (targetType) {
		case EffectType.maguro:
			return useMaguroProfile(level);

		case EffectType.ikura:
			return useIkuraProfile(level);

		case EffectType.ebi:
			return useEbiProfile(level);

		case EffectType.matcha:
			return useMatchaProfile(level);

		default:
			return useMaguroProfile(level);
	}
};
