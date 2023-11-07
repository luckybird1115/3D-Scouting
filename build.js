const rollup = require( 'rollup' );
const watch = require( 'rollup-watch' );
const babel = require( 'rollup-plugin-babel' );
const nodeResolve = require( 'rollup-plugin-node-resolve' );
const commonjs = require( 'rollup-plugin-commonjs' );

const fs = require( 'fs' );

const defaultPlugins = [
  nodeResolve(),
  commonjs(),
  babel( {
    compact: false,
    exclude: ['node_modules/**'],
    presets: ['es2015-loose-rollup'],
  } ),
];

// config to feed the watcher function
const config = ( entry, dest, moduleName, plugins ) => {
  return {
    entry,
    dest,
    format: 'iife',
    moduleName,
    plugins,
  }
}

// stderr to stderr to keep `rollup main.js > bundle.js` from breaking
const stderr = console.error.bind( console );

const eventHandler = ( file ) => {
  return ( event ) => {
    switch ( event.code ) {
      case 'STARTING':
        stderr( 'checking rollup-watch version...' );
        break;
      case 'BUILD_START':
        stderr( `bundling ${file}...` );
        break;
      case 'BUILD_END':
        stderr( `bundled ${file} in ${event.duration}ms. Watching for changes...` );
        break;
      case 'ERROR':
        stderr( `error: ${event.error} with ${file}` );
        break;
      default:
        stderr( `unknown event: ${event} from ${file}` );
    }
  };
};

// Read all files in the entry folder
fs.readdir( 'src/entry', ( err, files ) => {
  files.forEach( ( file ) => {
    const entryConfig = config( 'src/entry/' + file, 'threejscss/scouting_app.js', file, defaultPlugins );
    const watcher = watch( rollup, entryConfig );
    const entryEventHandler = eventHandler( file );
    watcher.on( 'event', entryEventHandler );
  } );
} );
