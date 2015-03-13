# DEVFEST MN 2015 Website

# Getting Started

This project is built through Gulp, with packages managed by NPM and Bower, so
a few quick commands are necessary to get set up.

### Building

  - ```sudo npm install```  
  - ```bower install```
  - ```gulp```
  
### Running

  Build steps are managed by a set of tasks in gulpfile.js.
  
  To serve files from /dist, run:
  - ```gulp serve```
  
  This will simultaneously serve files from dist/, and start live-reload on the app/
  directory to begin watching for changes there and rebuilding/reloading dist/ as they occur
  
### Developing

  All elements are self-contained in their own directory within /app
  
  The best way create a new element and maintain the current architecture is to use the 
  [Official Gulp-Polymer Yeoman Generator](https://github.com/yeoman/generator-polymer) that the project was scaffolded with.
  
  Full instructions for installing the necessary Yeoman dependencies and using the generator's commands to 
  build out new elements of the project are helpfully listed there. 
  
  
  
  
  

