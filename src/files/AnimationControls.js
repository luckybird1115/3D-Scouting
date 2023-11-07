// Uses the three.js animation system described here: https://threejs.org/docs/#manual/introduction/Animation-system
import * as THREE from 'three';

let mixer;
const actions = {};

function setWeight( action, weight ) {
	action.enabled = true;
	action.setEffectiveTimeScale( 1 );
	action.setEffectiveWeight( weight );
}

function executeCrossFade( startAction, endAction, duration ) {
	// Not only the start action, but also the end action must get a weight of 1 before fading
	// (concerning the start action this is already guaranteed in this place)

	setWeight( endAction, 1 );
	endAction.time = 0;

	startAction.crossFadeTo( endAction, duration, false );
}

// add an event listener to call executeCrossFade() at teh end of the current action's current loop
function synchronizeCrossFade( startAction, endAction, duration ) {

	function onLoopFinished( event ) {
		if ( event.action === startAction ) {
			mixer.removeEventListener( 'loop', onLoopFinished );
			executeCrossFade( startAction, endAction, duration );
		}
	}

  mixer.addEventListener( 'loop', onLoopFinished );
}

function prepareCrossFade( startAction, endAction, duration ) {

	if ( !duration ) duration = 1;
	if ( startAction.name === 'offensive_idle' ) {
		duration = 1;
	} else {
		duration = startAction._clip.duration - startAction.time;
	}
	if ( duration < 1 ) duration = 1;
	executeCrossFade( startAction, endAction, duration );
	// } else {
	//   synchronizeCrossFade( startAction, endAction, duration );
	// }
}

export default class AnimationControls {
	constructor( ) {
		this.isPaused = true;
		this.currentAction = null;
	}
	initMixer( object ) {
		mixer = new THREE.AnimationMixer( object );
	}
	update( delta ) {
		if ( this.isPaused ) return;
		if ( mixer !== undefined ) mixer.update( delta );
	}
	play() {
		this.isPaused = false;
	}
	pause() {
		this.isPaused = true;
	}
	playAction( name ) {
		const action = actions[ name ];
		if ( action === undefined ) {
			console.warn( 'Action \'' + name + '\' was not found.' );
			return;
		}
		// don't restart already playing action
		if ( this.currentAction && this.currentAction.name === name ) return;
		// if this is the first action being played just start immediately
		if ( this.currentAction === null ) {
			this.currentAction = action;
			setWeight( this.currentAction, 1 );
		}
		// otherwise crossfade to the new action
		else {
			// console.log( 'warping from ' + this.currentAction.name + ' to ' + action.name)
			const oldAction = this.currentAction;
			this.currentAction = action;
			this.currentAction.reset();
			const duration = 1;
			prepareCrossFade( oldAction, this.currentAction, duration );
		}
		this.isPaused = false;
	}
	playActionOLD( name ) {
		if ( this.currentAction && this.currentAction.name === name ) return;
		let actionFound = false;
		Object.values( actions ).forEach( ( action ) => {
			if ( action.name === name ) {
				this.currentAction = action;
				action.play();
				this.isPaused = false;
				actionFound = true;
			} else action.stop();
		} );
		if ( !actionFound ) {
			console.warn( 'Action \'' + name + '\' was not found.' );
			this.isPaused = true;
		}
	}
	setTimeScale( timeScale, name ) {
		const action = actions[ name ];
		const currentTimeScale = action.getEffectiveTimeScale();
		action.warp( currentTimeScale, timeScale, 0.25 );
	}
	initAnimation( animationClip, optionalRoot ) {
		const action = mixer.clipAction( animationClip, optionalRoot );
		action.name = animationClip.name;
		actions[ animationClip.name ] = action;
		setWeight( action, 0 );
		action.play();
	}
	
}