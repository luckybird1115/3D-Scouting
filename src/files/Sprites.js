import * as THREE from 'three';
import HTMLControl from './HTMLControl.js';
import Sprite from './Sprite.js';


export default class Sprites {

  constructor( app ) {

    this.app = app;

    this.attributes = HTMLControl.attributes;

    this.loadTexture();

    this.sprites = {};

    this.arm = 'right';

    // holds reference to the positions of the bones that are targets for the sprite
    this.targets = {

      default: new THREE.Vector3(),

    };

    // positions of the actual sprite, calculated relative to the bone. Note that these are only
    // recalculated each time the relevant target it used, so they must always be used in pairs,
    // with the target being accessed first
    this.positions = {

      default: new THREE.Vector3(),

    };

  }

  init( player ) {

    this.player = player;

    this.initPositions();
    this.initTargets();

    this.initSprites();

  }

  loadTexture() {

    // this.texture = new THREE.TextureLoader().load( '/threejscss/modelanimations/power_bar_sheet.png' );
    // this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    // // texture is a sprite sheet 10 frames wide and 1 tall
    // this.texture.repeat.set( 0.1, 1 );
    // // initialize the texture to the middle frame
    // this.texture.offset.set( 0.4, 0 );

  }

  // hold references to bones
  initTargets() {

    const self = this;
    const pos = new THREE.Vector3();

    this.targets.rightArm = this.player.getObjectByName( 'mixamorigRightShoulder' );
    this.targets.leftArm = this.player.getObjectByName( 'mixamorigLeftShoulder' );

    Object.defineProperties( this.targets, {

      armStrength: {

        get: () => {

          if ( self.arm === 'right' || self.arm === 'both' ) {

            // this.targets.rightArm.getWorldPosition( pos );
            // this.positions.armStrength.copy( pos );
            // this.positions.armStrength.x -= 45;

          } else {

            // this.targets.leftArm.getWorldPosition( pos );
            // this.positions.armStrength.copy( pos );
            // this.positions.armStrength.x += 45;

          }

          pos.y -= 25;
          this.positions.armStrength.y += 15;

          return pos;

        },

      },

    } );

  }

  initPositions() {

    this.positions.armStrength = new THREE.Vector3();

  }

  initSprites() {

    this.sprites.armStrength = new Sprite(
      this.texture,
      this.attributes[ 'arm-strength' ],
      'armStrength',
      this.app,
      this.targets.armStrength,
      this.positions.armStrength,
    );

  }

  // set to right, left or both
  setArm( arm ) {

    arm = arm || 'right';

    this.arm = arm;

  }

  hideAll() {

    Object.values( this.sprites ).forEach( ( sprite ) => {

      sprite.fadeOut();

    } );

  }

  hideAllExcept( spriteName ) {

    Object.values( this.sprites ).forEach( ( sprite ) => {

      if ( sprite.name === spriteName ) sprite.fadeIn();
      else sprite.fadeOut();

    } );

  }

  update( delta ) {

    Object.values( this.sprites ).forEach( ( sprite ) => {

      sprite.update( delta );

    } );

  }

}
