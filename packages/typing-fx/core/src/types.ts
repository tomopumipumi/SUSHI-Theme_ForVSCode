export interface GraphicLevel {
	width: number;
	height: number;
	svgContent: string;
}

export interface GraphicData {
	width: number;
	height: number;
	svgUrl: string;
}

export interface Point {
	line: number;
	character: number;
}

export interface CoreSettings {
	bounceTopDistance: number;
	bounceBottomDistance: number;
	particleSpeedMultiplier: number;
	particleLifespanMultiplier: number;
	enableParticleCollision: boolean;
	particleRestitution: number;
}
