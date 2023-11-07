import * as THREE from 'three';

export default class Lighting {

  constructor( app ) {

    this.app = app;

    this.initLights();

  }

  initLights() {

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 );
    this.app.scene.add( ambientLight );

    // ****  METHOD 1:   3 POINT LIGHTING ***************************
    // Traditional 3 point light setup - slightly more expensive due to
    // two extra lights

    const backLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
    backLight.position.set( 130, 200, 150 );

    const keyLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
    keyLight.position.set( 100, 50, 0 );

    const fillLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
    fillLight.position.set( 75, 75, 50 );

    this.app.scene.add( backLight, keyLight, fillLight );


    // ****  METHOD 2:   CAMERA LIGHT ***********************************
    // Visually similar to 3 point lighting, but cheaper as only two lights
    // are needed

    // this.pointLight = new THREE.PointLight( 0xffffff, 0.5, 0, 0 );
    // this.app.camera.add( this.pointLight );
    // this.app.scene.add( this.app.camera );

  }

}