*********** REQUIREMENTS ***********

Node.js must be installed first (for dev environment only, if you are just including /threejscss/entry.js or /threejscss/entry.min.js you do do need Node.js ).

Run 'npm install' from the project directory to install dependencies

NODE DEPENDENCIES:
 - thee.js (r87, should work with any recent version)
 - loadash.throttle: this is used to prevent the resizing function being called too often
 - babel-polyfill: you should be able to replace this with any other polyfill that includes promises

OTHER DEPENDENCIES
 - /threejscss/inflate.min.js: required for loading FBX Binary files and must be included before /threejscss/entry.js. See index.html for how to include this

*********** DEV SERVER ***********

 A http server is also installed with 'npm install', run it with

 http-server . -p 8000

 Then open http://127.0.0.1:8000/scouting_app.html


 If this causes errors try changing the port (8000) to another number (8080, 8888 etc), and if this causes
 errors then try turning off your firewall.


*********** BUILDING FROM SRC ***********

 If changing any of the files in the src folder, run

 node ./build.js

 which will watch for changes and update the /threejscss/entry.js file.

*********** MINIFYING BUILD ***********

To minify the /threejscss/entry.js file run

node ./minify-build.js

This will compress /threejscss/entry.js and create /threejscss/entry.min.js

*********** INCLUDING SRC IN YOUR APP ***********
Alternately if you want to import the src into your app instead of building,  include all files in the /src/fbx_viewer folder and

import 'babel-polyfill'; // or another polyfill that includes promises
import Simulation from 'nfl/Simulation.js';

See /src/entry/entry.js for usage.


*********** FINAL NOTE ***********

Your page MUST include a HTML structure similar to the structure found in scouting_app.html
However all references to HTML elements are contained in /src/HTMLControl.js so if you are changing classes / ids
in your page you should just need to modify that file.


















*********** REQUIREMENTS ***********

Node.js must be installed first (for dev environment only, if you are just including /threejscss/entry.js or /threejscss/entry.min.js you do do need Node.js ).

Run 'npm install' from the project directory to install dependencies

NODE DEPENDENCIES:
 - thee.js (r87, should work with any recent version)
 - loadash.throttle: this is used to prevent the resizing function being called too often
 - babel-polyfill: you should be able to replace this with any other polyfill that includes promises

OTHER DEPENDENCIES
 - /threejscss/inflate.min.js: required for loading FBX Binary files and must be included before /threejscss/entry.js. See index.html for how to include this

*********** DEV SERVER ***********

 A http server is also installed with 'npm install', run it with

 http-server . -p 8000

 Then open http://127.0.0.1:8000/scouting_app.html


 If this causes errors try changing the port (8000) to another number (8080, 8888 etc), and if this causes
 errors then try turning off your firewall.


*********** BUILDING FROM SRC ***********

 If changing any of the files in the src folder, run

 node ./build.js

 which will watch for changes and update the /threejscss/entry.js file.

*********** MINIFYING BUILD ***********

To minify the /threejscss/entry.js file run

node ./minify-build.js

This will compress /threejscss/entry.js and create /threejscss/entry.min.js

*********** INCLUDING SRC IN YOUR APP ***********
Alternately if you want to import the src into your app instead of building,  include all files in the /src/files folder and use

import 'babel-polyfill'; // or another polyfill that includes promises
import '/src/files/main.js';

See /src/entry/entry.js for example usage.

*********** FINAL NOTE ***********

Your page MUST include a HTML structure similar to the structure found in scouting_app.html
However all references to HTML elements are contained in /src/HTMLControl.js so if you are changing classes / ids
in your page you should just need to modify that file.