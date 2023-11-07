const uncss = require( 'uncss' );
const glob = require( 'glob' );
const watch = require( 'node-watch' );
const fs = require( 'fs' );
const sass = require( 'node-sass' );
const autoprefixer = require( 'autoprefixer' );
const postcss = require( 'postcss' );

const stylesheetSourceLocation = 'scss/';
const stylesheetLocation = 'threejscss/';

let inputFile;
// let outputFile;

if ( !fs.existsSync( stylesheetLocation ) ) {
  fs.mkdirSync( stylesheetLocation );
}

const writeFile = ( fileName, data ) => {

  fs.writeFileSync( stylesheetLocation + fileName, data, 'utf8' );

};

const un = ( htmlFilesArray, css, outputFile ) => {

  uncss( htmlFilesArray, {

    raw: css,
    ignoreSheets: [/\/css\//],

  }, ( error, output ) => {

    if ( error ) {
      console.log( err );
    }


    console.log( 'Writing file: ' + outputFile );
    writeFile( outputFile, output )

  } );
};

const cleanCSS = ( css, outputFile ) => {

  // for now skipping uncss
  console.log( 'Writing file: ' + outputFile );
  writeFile( outputFile, css );


  // const pages = outputFile.slice( 0, -4 );

  // // this will have to be done on a per page basis and test
  // if ( pages === 'splash' ) {

  //   un( ['_site/index.html'], css );

  // } else {

  //   console.log( 'Writing file: ' + outputFile );
  //   writeFile( outputFile, css );

    // other pages not tested yet, don't reduce css

    // glob( '_site/**/' + pages +  '/**/*.html', ( err, files ) => {


    //   console.log( files );

    //   if ( err ) {
    //     console.log( err );
    //   }

    //   // un( files, css );

    // } );
  // }


};

const prefixCSS = ( css, outputFile ) => {

  postcss( [ autoprefixer ] ).process( css ).then( ( object ) => {
    object.warnings().forEach( ( warn ) => {

      console.warn( warn.toString() );

    } );

    cleanCSS( object.css, outputFile );

  } );

};

const compileSCSS = ( file ) => {

  // don't process partials
  if ( file.slice( 0, 1 ) === '_' ) return;
  if ( file.slice( -4 ) !== 'scss' ) return;

  inputFile = stylesheetSourceLocation + file;
  const outputFile = file.slice( 0, -5 ) + '.css';

  sass.render( {
    file: inputFile,
    outputStyle: 'compressed',
  }, ( err, result ) => {

    if ( err ) {

      console.log( err );

    } else {

      prefixCSS( result.css, outputFile );

    }

  } );


};


// pass in a single filename, e.g. 'main' to process only that file
if ( process.argv[ 2 ] !== undefined ) {

  const file = process.argv[ 2 ] + '.scss';

  compileSCSS( file );

  watch( stylesheetSourceLocation, { recursive: true }, () => {

    compileSCSS( file );

  } );

} else {

  fs.readdir( stylesheetSourceLocation, ( err, files ) => {

    if ( err ) console.log( err );

    files.forEach( ( file ) => {

      compileSCSS( file );

    } );

    watch( stylesheetSourceLocation, { recursive: true }, () => {

      files.forEach( ( file ) => {

        compileSCSS( file );

      } );

    } );

  } );

}
