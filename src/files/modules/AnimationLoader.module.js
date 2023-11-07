import * as THREE from 'three';
/**
 * @author bhouston / http://clara.io/
 */

function AnimationLoader( manager ) {
	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
}
Object.assign( AnimationLoader.prototype, {
	load( url, onLoad, onProgress, onError ) {
		const scope = this;
		const loader = new THREE.FileLoader( scope.manager );
		loader.load( url, ( text ) => {
			scope.parse( JSON.parse( text ), onLoad );
		}, onProgress, onError );
	},
	parse( json, onLoad ) {
		const tracks = json.tracks.map( t => THREE.KeyframeTrack.parse( t ) );
		const clip = new THREE.AnimationClip( json.name, json.duration, tracks );
		onLoad( clip );
	},
} );

export default AnimationLoader;
