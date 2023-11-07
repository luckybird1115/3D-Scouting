const UglifyJS = require( 'uglify-js' );
const fs = require( 'fs' );

const inputFile = 'threejscss/scouting_app.js';
const outputFile = 'threejscss/scouting_app.min.js';

const uglifyJSOptions = {

  compress: {

    sequences: true,
    properties: true,
    dead_code: true,
    drop_debugger: true,
    unsafe: false,
    unused: true,
    hoist_funs: true,
    hoist_vars: true,
    if_return: true,
    join_vars: true,
    cascade: true,
    loops: false,
    negate_iife: true,
    warnings: true,

  },
  // ie8: false,
  mangle: true,

};


const minifyFile = ( input, output ) => {

  console.log( 'Minifying ' + input );


  const inputCode = fs.readFileSync( input, 'utf8' );

  // minify input code
  const outputCode = UglifyJS.minify( inputCode, uglifyJSOptions ).code;

  fs.writeFileSync( output, outputCode, 'utf8' );

  console.log( 'Finished minifying and wrote ' + output );

}

minifyFile( inputFile, outputFile );

