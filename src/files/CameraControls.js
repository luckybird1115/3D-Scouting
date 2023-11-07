// Control camera targeting and THREE.OrbitControl settings
import * as THREE from 'three';

export default class CameraControls {
	constructor( app ) {
		this.camera = app.camera;
		this.controls = app.controls;
		this.targetChanged = false;
		this.zoomLevelChanged = false;
		this.dynamicTracking = false;
		this._zoomLevel = 1;
		this.targetTrackingSpeed = 1;
		this.currentTargetName = 'default';
	}
	set zoomLevel( value ) {
		if ( this._zoomLevel === value ) return;
		this.zoomLevelChanged = true;
		this._zoomLevel = value;
	}
	get zoomLevel() {
		return this._zoomLevel;
	}
	set currentTarget( targetName ) {
		if ( this.currentTargetName === targetName ) return;
		this.currentTargetName = targetName;
		this._currentTarget = this.targets[ targetName ];
		this.targetChanged = true;
		if ( targetName.includes( 'dynamic' ) ) {
			this.dynamicTracking = true;
			this.targetTrackingSpeed = 2;
		}
		else {
			this.dynamicTracking = false;
			this.targetTrackingSpeed = 1;
		}
	}
	get currentTarget() {
		return this.targets[ this.currentTargetName ];
	}
	initCamera() {
		const boundingBox = new THREE.Box3().setFromObject( this.player );
		const center = boundingBox.getCenter();
		const size = boundingBox.getSize();
		// get the max side of the bounding box
		const maxDim = Math.max( size.x, size.y, size.z );
		const fov = this.camera.fov * ( Math.PI / 180 );
		const cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );
		this.camera.position.z = cameraZ;
		const minZ = boundingBox.min.z;
		const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;
		this.camera.far = cameraToFarEdge * 3;
		this.camera.updateProjectionMatrix();
		// set camera to rotate around center of loaded object
		this.controls.target.copy( center );
		// prevent camera from zooming out far enough to create far plane cutoff
		this.controls.maxDistance = cameraToFarEdge * 2;
	}
	initControls() {
		this.controls.minPolarAngle = 0;
		this.controls.maxPolarAngle = Math.PI / 2;
		// this.controls.enablePan = false;
		// save the initial position. This can be regained with controls.reset()
		this.controls.saveState();
	}
	init( player ) {
		this.player = player;
		this.initCamera();
		this.initControls();
		this.initTargets();
	}
	initTargets() {
		this.targets = {};
		// used for targeting - position is recaulcated per frame if this.dynamicTracking = true
		this.dynamicTarget = this.player.getObjectByName( 'mixamorigHead' );
		this.targets.dynamic = new THREE.Object3D();
		this.targets.dynamicUpper = new THREE.Object3D();
		this.targets.default = new THREE.Object3D();
		this.targets.default.position.copy( this.controls.target );
		this.targets.head = new THREE.Object3D();
		// this.targets.head.position.copy( this.player.getObjectByName( 'WAFPhelmet' ).position );
		this.targets.torso = this.targets.head.clone();
		// this.targets.torso.position.y = ( this.targets.head.position.y + this.targets.default.position.y ) / 2;
		this.targets.leftArm = this.targets.torso.clone();
		// this.targets.leftArm.position.x += 25;
		this.targets.rightArm = this.targets.torso.clone();
		// this.targets.rightArm.position.x -= 25;
		this.targets.arms = this.targets.rightArm;
		this.currentTarget = 'default';
	}
	updateTarget( delta ) {
		if ( this.dynamicTracking ) {
		this.dynamicTarget.getWorldPosition( this.targets.dynamicUpper.position );
		this.targets.dynamic.position.copy( this.targets.dynamicUpper.position );
		this.targets.dynamic.position.y = 100;
	}
	const distance = this.controls.target.distanceTo( this.currentTarget.position );
		if ( distance > 0.1 || this.dynamicTracking ) {
			const start = new THREE.Vector3().copy( this.controls.target );
			const direction = start.sub( this.currentTarget.position ).normalize();
			direction.multiplyScalar( distance * delta * this.targetTrackingSpeed );
			this.controls.target.sub( direction );
		}
		else {
			this.controls.target.copy( this.currentTarget.position );
			this.targetChanged = false;
		}
	}
	updateZoomLevel( delta ) {
		const diff = ( this.controls.object.zoom - this.zoomLevel ) * delta;
		if ( Math.abs( diff ) > 0.001 ) {
			this.controls.object.zoom -= diff;
			this.controls.object.updateProjectionMatrix();
		}
		else {
			this.controls.object.zoom = this.zoomLevel;
			this.zoomLevelChanged = false;
		}
	}
	// per frame calculation
	update( delta ) {
		if ( this.targetChanged || this.dynamicTracking ) this.updateTarget( delta );
		if ( this.zoomLevelChanged ) this.updateZoomLevel( delta );
	}
	focusHead() {
		this.currentTarget = 'head';
		this.zoomLevel = 3;
	}
	focusUpper() {
		this.currentTarget = 'torso';
		this.zoomLevel = 2;
	}
	focusArms() {
		this.currentTarget = 'arms';
		this.zoomLevel = 2;
	}
	focusDefault() {
		this.currentTarget = 'default';
		this.zoomLevel = 1;
	}
	focusDynamic() {
		this.currentTarget = 'dynamic';
		this.dynamicTracking = true;
		this.zoomLevel = 1;
	}
	focusDynamicUpper() {
		this.currentTarget = 'dynamicUpper';
		this.zoomLevel = 2;
	}
	setArmTarget( arm ) {
		arm = arm || 'right';
		if ( arm === 'right' ) {
			this.targets.arms = this.targets.rightArm;
		}
		else if ( arm === 'left' ) {
			this.targets.arms = this.targets.leftArm;
		}
		else if ( arm === 'both' ) {
			this.targets.arms = this.targets.torso;
		}
		this.focusArms();
	}
}
