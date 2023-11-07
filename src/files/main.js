import * as THREE from 'three';
import App from './App/App.js';
import loaders from './loaders.js';

import AttributeControls from './AttributeControls.js';
import AnimationControls from './AnimationControls.js';
import CameraControls from './CameraControls.js';
// import Sprites from './Sprites.js';
import Lighting from './Lighting.js';
import HTMLControl from './HTMLControl.js';

import throttle from 'lodash.throttle';


// Set up THREE caching
THREE.Cache.enabled = true;

class Main {
	constructor() {
		this.preLoad();
		this.textureLoad();
		this.loadModels("idle_low");//warmup
		this.postLoad();

		this.selected_animation = "idle_low";//warmup
		this.selected_skin = "general";
		this.selected_cloth = "yellow";
		this.tallValue = 1;
		this.weightValue = 1;
		this.SelectAnimation();
		this.skinChildNum = -1;
	}
	preLoad() {
		const self = this;
		this.app = new App( HTMLControl.canvas );
		this.app.renderer.setClearColor(0x000000 , 1.0 );//0xf7f7f7
		this.app.initControls();
		this.lighting = new Lighting( this.app );
		this.animationControls = new AnimationControls();
		this.attributeControls = new AttributeControls();
		this.cameraControls = new CameraControls( this.app );
		// this.sprites = new Sprites( this.app );
		this.loadingPromises = [];

		this.raycaster = new THREE.Raycaster();
		this.cylinderGroup  = new THREE.Group();
		this.powerGroup  = new THREE.Group();

		// Put any per frame calculation here
		this.app.onUpdate = function () {
			// NB: use self inside this function, 'this' will refer to this.app
			const delta = this.delta / 1000;
			self.animationControls.update( delta );
			self.cameraControls.update( delta );
			// self.sprites.update( delta );
		};

		// put any per resize calculations here (throttled to once per 250ms)
		this.app.onWindowResize = function () {
			// NB: use self inside this function, 'this' will refer to this.app
		};

		this.initFog();
		this.addGround();
		this.vitualModel();
		this.visibleInitial();
		this.visibleSetting();
	}
	textureLoad(){
		this.generalYellow = new THREE.TextureLoader().load( "/threejscss/modelanimations/general_yellow.png" );
		this.generalRed    = new THREE.TextureLoader().load( "/threejscss/modelanimations/general_red.png" );
		this.generalGreen  = new THREE.TextureLoader().load( "/threejscss/modelanimations/general_green.png" );

		this.whiteYellow = new THREE.TextureLoader().load( "/threejscss/modelanimations/white_yellow.png" );
		this.whiteRed    = new THREE.TextureLoader().load( "/threejscss/modelanimations/white_red.png" );
		this.whiteGreen  = new THREE.TextureLoader().load( "/threejscss/modelanimations/white_green.png" );

		this.blackYellow = new THREE.TextureLoader().load( "/threejscss/modelanimations/black_yellow.png" );
		this.blackRed    = new THREE.TextureLoader().load( "/threejscss/modelanimations/black_red.png" );
		this.blackGreen  = new THREE.TextureLoader().load( "/threejscss/modelanimations/black_green.png" );
	}
	// fbx files load
	loadModels(modelName) {
		const self = this;
		if (modelName == "idle_low") self.cylinderGroup.visible = true; else self.cylinderGroup.visible = false;
		var urlStr = "/threejscss/modelanimations/"+modelName+".FBX";

		if (self.player){
			self.app.animationStatus = "none";
			self.app.scene.remove(self.player);
			self.player = null;
			self.objectPlayer = null;
		}

		const playerPromise = loaders.fbxLoader( urlStr ).then( ( object ) => {
			for (var i = 0; i < object.children.length; i++) {
				if (object.children[i].type == "SkinnedMesh"){
					this.skinChildNum = i;
				}
			}

			InputPlayer(object, modelName);
			// self.player = object;
			self.objectPlayer = new THREE.AnimationMixer( object );

			const animation = self.objectPlayer.clipAction( object.animations[ 0 ] );
			animation.play();

			self.app.animationStatus = "play";
			self.app.scene.add(object);
			self.app.play(self.objectPlayer);
		});
		function InputPlayer(object){
			self.player = object;
			// initial skin and cloth
				if (self.selected_skin == "general"){
					if 		(self.selected_cloth == "yellow") self.player.children[self.skinChildNum].material.map = self.generalYellow;
					else if (self.selected_cloth == "red") 	  self.player.children[self.skinChildNum].material.map = self.generalRed;
					else if (self.selected_cloth == "green")  self.player.children[self.skinChildNum].material.map = self.generalGreen;
				}
				else if (self.selected_skin == "white"){
					if 		(self.selected_cloth == "yellow") self.player.children[self.skinChildNum].material.map = self.whiteYellow;
					else if (self.selected_cloth == "red") 	  self.player.children[self.skinChildNum].material.map = self.whiteRed;
					else if (self.selected_cloth == "green")  self.player.children[self.skinChildNum].material.map = self.whiteGreen;
				}
				else if (self.selected_skin == "black"){
					if 		(self.selected_cloth == "yellow") self.player.children[self.skinChildNum].material.map = self.blackYellow;
					else if (self.selected_cloth == "red") 	  self.player.children[self.skinChildNum].material.map = self.blackRed;
					else if (self.selected_cloth == "green")  self.player.children[self.skinChildNum].material.map = self.blackGreen;
				}
			
			self.player.children[self.skinChildNum].material.needsUpdate = true;
			self.player.children[self.skinChildNum].material.color.setHex(0xFFFFFF);
			var delayTime = 10;

			// change skin color
				self.attributeControls.skinSelecters.skin_general.addEventListener( 'click', throttle( ( e ) => {
					e.preventDefault();
					if (self.selected_skin != "general"){
						self.selected_skin = "general";
						// self.texture = new THREE.TextureLoader().load( "/threejscss/modelanimations/general.png" );
						if 		(self.selected_cloth == "yellow") self.player.children[self.skinChildNum].material.map = self.generalYellow;
						else if (self.selected_cloth == "red") 	  self.player.children[self.skinChildNum].material.map = self.generalRed;
						else if (self.selected_cloth == "green")  self.player.children[self.skinChildNum].material.map = self.generalGreen;
					}
				}, delayTime ), false );
				self.attributeControls.skinSelecters.skin_white.addEventListener( 'click', throttle( ( e ) => {
					e.preventDefault();
					if (self.selected_skin != "white"){
						self.selected_skin = "white";
						// self.texture = new THREE.TextureLoader().load( "/threejscss/modelanimations/white.png" );
						if 		(self.selected_cloth == "yellow") self.player.children[self.skinChildNum].material.map = self.whiteYellow;
						else if (self.selected_cloth == "red") 	  self.player.children[self.skinChildNum].material.map = self.whiteRed;
						else if (self.selected_cloth == "green")  self.player.children[self.skinChildNum].material.map = self.whtieGreen;
					}
				}, delayTime ), false );
				self.attributeControls.skinSelecters.skin_black.addEventListener( 'click', throttle( ( e ) => {
					e.preventDefault();
					if (self.selected_skin != "black"){
						self.selected_skin = "black";
						// self.texture = new THREE.TextureLoader().load( "/threejscss/modelanimations/black.png" );
						if 		(self.selected_cloth == "yellow") self.player.children[self.skinChildNum].material.map = self.blackYellow;
						else if (self.selected_cloth == "red") 	  self.player.children[self.skinChildNum].material.map = self.blackRed;
						else if (self.selected_cloth == "green")  self.player.children[self.skinChildNum].material.map = self.blackGreen;
					}
				}, delayTime ), false );

			// change cloth color
				self.attributeControls.clothSelecters.cloth_yellow.addEventListener( 'click', throttle( ( e ) => {
					e.preventDefault();
					if (self.selected_cloth != "yellow"){
						self.selected_cloth = "yellow";
						// self.texture = new THREE.TextureLoader().load( "/threejscss/modelanimations/general.png" );
						if 		(self.selected_skin == "general") self.player.children[self.skinChildNum].material.map = self.generalYellow;
						else if (self.selected_skin == "white")   self.player.children[self.skinChildNum].material.map = self.whiteYellow;
						else if (self.selected_skin == "black")   self.player.children[self.skinChildNum].material.map = self.blackYellow;
					}
				}, delayTime ), false );
				self.attributeControls.clothSelecters.cloth_red.addEventListener( 'click', throttle( ( e ) => {
					e.preventDefault();
					if (self.selected_cloth != "red"){
						self.selected_cloth = "red";
						// self.texture = new THREE.TextureLoader().load( "/threejscss/modelanimations/general.png" );
						if 		(self.selected_skin == "general") self.player.children[self.skinChildNum].material.map = self.generalRed;
						else if (self.selected_skin == "white")   self.player.children[self.skinChildNum].material.map = self.whiteRed;
						else if (self.selected_skin == "black")   self.player.children[self.skinChildNum].material.map = self.blackRed;
					}
				}, delayTime ), false );
				self.attributeControls.clothSelecters.cloth_green.addEventListener( 'click', throttle( ( e ) => {
					e.preventDefault();
					if (self.selected_cloth != "green"){
						self.selected_cloth = "green";
						// self.texture = new THREE.TextureLoader().load( "/threejscss/modelanimations/general.png" );
						if 		(self.selected_skin == "general") self.player.children[self.skinChildNum].material.map = self.generalGreen;
						else if (self.selected_skin == "white")   self.player.children[self.skinChildNum].material.map = self.whiteGreen;
						else if (self.selected_skin == "black")   self.player.children[self.skinChildNum].material.map = self.blackGreen;
					}
				}, delayTime ), false );

			//change tall and weight
				self.attributeControls.weightChange.addEventListener( 'input', throttle( ( e ) => {
					e.preventDefault();
					self.weightValue = e.target.value;
					self.player.scale.set(self.weightValue, self.tallValue, self.weightValue);
				}, 100 ), false );
				self.attributeControls.tallerChange.addEventListener( 'input', throttle( ( e ) => {
					e.preventDefault();
					self.tallValue = e.target.value;
					self.player.scale.set(self.weightValue, self.tallValue, self.weightValue);
				}, 100 ), false );
			
		}
		this.attributeControls.canvas.addEventListener( 'mousemove', throttle( ( event ) => {
			if (self.selected_animation != "idle_low") return;
			var mouse = new THREE.Vector2();
			mouse.x =  ((event.clientX - 370) / (window.innerWidth - 370) ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			self.raycaster.setFromCamera( mouse, self.app.camera );
			var intersects = self.raycaster.intersectObjects( self.cylinderGroup.children );//planes

			if(intersects.length > 0) {
				self.powerGroup.visible = true;
				if 		(intersects[0].object.name == "leftArm")   self.powerGroup.position.set(-45, 120, 10);
				else if (intersects[0].object.name == "rightArm")  self.powerGroup.position.set( 45, 120, 20);
				else if (intersects[0].object.name == "leftFoot")  self.powerGroup.position.set(-40, 30, 15);
				else if (intersects[0].object.name == "rightFoot") self.powerGroup.position.set( 40, 30, 20);
			}
			else {
				self.powerGroup.visible = false;
				
			}
			event.preventDefault();
		}, 10 ), false );

		// ball not currently used so just resolve the promise immediately
		const ballPromise = Promise.resolve();
		this.loadingPromises = [ playerPromise, ballPromise ];

	}

	postLoad() {
		Promise.all( this.loadingPromises ).then(
			() => {
				this.app.scene.add( this.player );

				// this.app.play(this.objectPlayer);

				this.cameraControls.init( this.player );

				// this.sprites.init( this.player );
				this.attributeControls.init( this.player );
				this.attributeControls.initAnimationControls( this.animationControls );
				this.attributeControls.initCameraControls( this.cameraControls );
				// this.attributeControls.initSprites( this.sprites );

				// this.attributeControls.enableControls();
			},
		);
	}

	initFog() {
		this.app.scene.fog = new THREE.Fog( 0xe8e8e8, 600, this.app.camera.far );
	}

	addGround() {
		// const geometry = new THREE.BoxBufferGeometry( 300, 300, 300 );
		const geometry = new THREE.PlaneBufferGeometry( 20000, 20000 );
		const material = new THREE.MeshPhongMaterial( { color: 0x80F080, shininess: 0.1 } );//0xb0b0b0
		const ground = new THREE.Mesh( geometry, material );
		ground.position.set( 0, -25, 0 );
		ground.rotation.x = -Math.PI / 2;
		ground.receiveShadow = true;
		this.app.scene.add( ground );
	}

	vitualModel() {
		// radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength
		//position z->y, x->x, y->z*-1         x->left-right,  y->verticle z->front-back
		var angle = Math.PI/180;
		var cylinderGeometry = new THREE.CylinderGeometry( 7, 7, 40, 12, 1 );
		var cylinderMaterial = new THREE.MeshPhongMaterial( { color: 0xFF0000, shininess: 0.1, transparent:true, opacity: 0.01 } );//0xb0b0b0
		var cylinderMeshes = [];
		var nameArray = ["leftArm", "leftArm", "rightArm", "rightArm", "leftFoot", "leftFoot", "rightFoot", "rightFoot"];
		var positionArray = [[-25, 140, 10], [-35, 110, 15], [27, 140, 25], [37, 110, 22], [-13, 25, 10], [-18, 63, 17], [15, 25, 33], [15, 65, 32]];
		var rotationArray = [[0, -15], [-20, -17], [20, 18], [-20, 17], [10, 5], [-12, -10], [0, 0], [-15, 10]];
		for (var i = 0; i < 8; i++) {
			cylinderMeshes[i] = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
			cylinderMeshes[i].name = nameArray[i];
			cylinderMeshes[i].position.set(positionArray[i][0], positionArray[i][1], positionArray[i][2]);
			cylinderMeshes[i].rotation.set(rotationArray[i][0] * angle, 0, rotationArray[i][1] * angle);
			this.cylinderGroup.add(cylinderMeshes[i]);
		}
		this.app.scene.add(this.cylinderGroup);

		var outerGeometry = new THREE.CylinderGeometry( 3, 3, 40, 12, 1 );
		var innerGeometry = new THREE.CylinderGeometry( 2, 2, 2, 8, 1 );
		var outerMaterial = new THREE.MeshPhongMaterial( { color: 0x00BB00, shininess: 0.1, transparent:true, opacity: 0.15 } );
		var outerMesh = new THREE.Mesh( outerGeometry, outerMaterial );

		this.powerGroup.add(outerMesh);
		var innerMeshes = [];
		outerMesh.position.set(0, 20, 0);
		for (var i = 0; i < 10; i++) {
			var innerMaterial = new THREE.MeshPhongMaterial( { color: 0xFF0000, shininess: 0.1, transparent:true} );
			innerMaterial.opacity = 1.0 - 0.06 * i;
			innerMeshes[i] = new THREE.Mesh( innerGeometry, innerMaterial );
			innerMeshes[i].position.set(0, 2 + i * 4, 0);
			this.powerGroup.add(innerMeshes[i]);
		}
		this.powerGroup.visible = true;
		this.app.scene.add(this.powerGroup);
	}

	SelectAnimation() {
		var delayTime = 10;
		this.attributeControls.animSelecters.idle_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "idle_low")		{this.selected_animation = "idle_low";	this.loadModels("idle_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.clapping_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "clapping_low")	{this.selected_animation = "clapping_low";	this.loadModels("clapping_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.catchball_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "catchball_low")	{this.selected_animation = "catchball_low";	this.loadModels("catchball_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.defeat_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "defeat_low")	{this.selected_animation = "defeat_low";	this.loadModels("defeat_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.defeat2_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "defeat2_low")	{this.selected_animation = "defeat2_low";	this.loadModels("defeat2_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.jump_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "jump_low")		{this.selected_animation = "jump_low";	this.loadModels("jump_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.kick_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "kick_low")		{this.selected_animation = "kick_low";	this.loadModels("kick_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.run_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "run_low")		{this.selected_animation = "run_low";	this.loadModels("run_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.runback_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "runback_low")	{this.selected_animation = "runback_low";	this.loadModels("runback_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.runfront_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "runfront_low")	{this.selected_animation = "runfront_low";	this.loadModels("runfront_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.runleft_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "runleft_low")	{this.selected_animation = "runleft_low";	this.loadModels("runleft_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.runright_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "runright_low")	{this.selected_animation = "runright_low";	this.loadModels("runright_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.shove_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "shove_low")	{this.selected_animation = "shove_low";	this.loadModels("shove_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.snap_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "snap_low")	{this.selected_animation = "snap_low";	this.loadModels("snap_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.tackle_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "tackle_low")	{this.selected_animation = "tackle_low";	this.loadModels("tackle_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.throw_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "throw_low")	{this.selected_animation = "throw_low";	this.loadModels("throw_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.touchdown_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "touchdown_low")	{this.selected_animation = "touchdown_low";	this.loadModels("touchdown_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.victory_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "victory_low")	{this.selected_animation = "victory_low";	this.loadModels("victory_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.victory2_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "victory2_low")	{this.selected_animation = "victory2_low";	this.loadModels("victory2_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.victory3_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "victory3_low")	{this.selected_animation = "victory3_low";	this.loadModels("victory3_low");}
		}, delayTime ), false );
		this.attributeControls.animSelecters.warmup_low.addEventListener( 'mousedown', throttle( ( e ) => {
			// e.preventDefault();
			if (this.selected_animation != "warmup_low")	{this.selected_animation = "warmup_low";	this.loadModels("warmup_low");}
		}, delayTime ), false );
	}

	visibleInitial(){
		this.attributeControls.leftItem.animations.classList.add("hide_item");
		this.attributeControls.leftItem.optionSetting.classList.add("show_item");
		// this.attributeControls.leftItem.animations.style.display = "none";
		// this.attributeControls.leftItem.optionSetting.style.display = "block";
	}
	visibleSetting(){
		self = this;
		var delayTime = 10;
		this.attributeControls.button.animationBtn.addEventListener( 'click', throttle( ( e ) => {
			self.attributeControls.leftItem.animations.classList.remove("hide_item");
			self.attributeControls.leftItem.optionSetting.classList.remove("show_item");

			self.attributeControls.leftItem.animations.classList.add("show_item");
			self.attributeControls.leftItem.optionSetting.classList.add("hide_item");
			// self.attributeControls.leftItem.animations.style.display = "block";
			// self.attributeControls.leftItem.optionSetting.style.display = "none";
		}, delayTime ), false );
		this.attributeControls.button.settingBtn.addEventListener( 'click', throttle( ( e ) => {
			self.attributeControls.leftItem.animations.classList.remove("show_item");
			self.attributeControls.leftItem.optionSetting.classList.remove("hide_item");

			self.attributeControls.leftItem.animations.classList.add("hide_item");
			self.attributeControls.leftItem.optionSetting.classList.add("show_item");
			// self.attributeControls.leftItem.animations.style.display = "none";
			// self.attributeControls.leftItem.optionSetting.style.display = "block";
			self.loadModels("idle_low");
		}, delayTime ), false );
	}

}

const main = new Main();
export default main;