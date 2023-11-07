import throttle from 'lodash.throttle';
import HTMLControl from './HTMLControl.js';

export default class AttributeControls {

	constructor() {
		this.canvas = HTMLControl.canvas;
		this.animSelecters = HTMLControl.animSelecters;
		this.skinSelecters = HTMLControl.skinSelecters;
		this.clothSelecters = HTMLControl.clothSelecters;
		this.weightChange = HTMLControl.weightChange;
		this.tallerChange = HTMLControl.tallerChange;
		this.leftItem = HTMLControl.leftItem;
		this.button = HTMLControl.button;
		this.dominantHand = 'right';
		this.passAnim = 'pass_right_hand';
		this.victoryAnim = 'victory';
	}
	init( player ) {
		this.player = player;
	}
	initAnimationControls( controls ) {
		this.animationControls = controls;
	}
	initCameraControls( controls ) {
		this.cameraControls = controls;
	}
	initSprites( sprites ) {
		this.sprites = sprites
	}
}