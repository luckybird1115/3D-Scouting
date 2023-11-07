// TODO: Refactor to make adding multiple sprites easier

import * as THREE from 'three';
import throttle from 'lodash.throttle';

const start = new THREE.Vector3();
const end = new THREE.Vector3();

export default class Sprite {

  constructor( texture, attribute, name, app, target, position ) {

    // clone the texture since each sprite will need to control the offset individually
    this.texture = texture;
    this.attribute = attribute;
    this.name = name || 'default';
    this.target = target;
    this.position = position;

    this.initLine();
    this.initObject();
    this.initListener();

    this.setPosition();

    app.scene.add( this.object, this.line );

    this.visible = false;

  }

  initObject() {

    this.spriteMat = new THREE.SpriteMaterial( { map: this.texture, transparent: true, opacity: 0 } );

    this.object = new THREE.Sprite( this.spriteMat );

    // make sure the sprite is always drawn on top
    this.object.renderOrder = 999;
    this.object.onBeforeRender = ( renderer ) => { renderer.clearDepth(); };

    this.object.scale.x = 50;
    this.object.scale.y = 50;

  }

  initLine() {

    this.lineMat = new THREE.LineBasicMaterial( { color: 0x000000, transparent: true, opacity: 0 } );
    this.lineGeo = new THREE.Geometry();
    this.lineGeo.vertices.push( this.target.clone(), this.position.clone() );
    this.line = new THREE.Line( this.lineGeo, this.lineMat );

  }

  initListener() {

    this.attribute.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.updateValue( e.target.value );

    }, 100 ), false );

  }

  updateValue( value ) {

    const offset = ( value - 1 ) / 10;

    this.texture.offset.set( offset, 0 );

  }

  set visible( bool ) {

    this.object.visible = bool;
    this.line.visible = bool;

  }

  get visible() {

    return this.object.visible;

  }

  // directly set the position to prevent jumps when fading in
  setPosition() {

    this.lineGeo.vertices[0].copy( this.target );
    this.object.position.copy( this.position );
    this.lineGeo.vertices[1].copy( this.position );
    this.lineGeo.verticesNeedUpdate = true;

  }

  fadeIn() {

    if ( this.visible ) return;

    this.setPosition();
    this.visible = true;

    clearInterval( this.fadeIntervalID );

    let opacity = this.lineMat.opacity;

    // fade in over 1 seconds
    const step = 1 / 60;

    this.fadeIntervalID = setInterval( () => {

      if ( opacity <= 1 ) {

        opacity += step;
        this.lineMat.opacity = opacity;
        this.spriteMat.opacity = opacity;

      } else {

        clearInterval( this.fadeIntervalID );

      }

    }, 17 );
  }

  fadeOut() {

    if ( !this.visible ) return;

    clearInterval( this.fadeIntervalID );

    let opacity = this.lineMat.opacity;

    // fade out over 1 seconds
    const step = 1 / 60;

    this.fadeIntervalID = setInterval( () => {

      if ( opacity >= 0 ) {

        opacity -= step;
        this.lineMat.opacity = opacity;
        this.spriteMat.opacity = opacity;

      } else {

        clearInterval( this.fadeIntervalID );
        this.visible = false;

      }

    }, 17 );
  }

  update( delta ) {

    if ( this.visible === false ) return;

    // update line origin
    this.lineGeo.vertices[0].copy( this.target );

    // update sprite position
    end.copy( this.position );

    const distance = end.distanceTo( this.object.position );

    if ( Math.abs( distance ) > 0.01 ) {

      start.copy( this.object.position );

      const direction = start.sub( end ).normalize();

      direction.multiplyScalar( distance * delta );

      this.object.position.sub( direction );

    }

    // update line end
    this.lineGeo.vertices[1].copy( this.object.position );
    this.lineGeo.verticesNeedUpdate = true;

  }

}
