'use strict';
var passthru = require('passthru');
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs-extra');
var admzip = require('adm-zip');

var NpLaravelGenerator = module.exports = function NpLaravelGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    //this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(NpLaravelGenerator, yeoman.generators.Base);

NpLaravelGenerator.prototype.askFor = function askFor() {
   var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);
  cb();

};

NpLaravelGenerator.prototype.app = function app() {
  
  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.copy('_gitignore', '.gitignore');
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.copy('_.htaccess', '.htaccess');
  this.copy('_Gruntfile.js', 'Gruntfile.js');
  this.copy('_.bowerrc', '.bowerrc');
  
  return this;
};

NpLaravelGenerator.prototype.composer = function composer() {
  var cb = this.async();

  this.fetch('https://getcomposer.org/composer.phar', 'composer.phar', function (err) {
    if (err) return console.log('Error downloading composer.phar');
    
    //create new Laravel project through composer create-project
    console.log('Creating new Laravel project');
    passthru("php composer.phar create-project laravel/laravel laravel-installer --prefer-dist --stability stable --no-dev", function (err, data) {
      if (err) {
        return console.log('Error creating laravel project from composer');
      }

      //copy files from /np-installer to current project root
      console.log('Copying Laravel files to project root folder');
      fs.copy('laravel-installer', '.', function (err) {
        if(err) {
          return console.log('Error copying files from Laravel installer dir to project root');
        }

        //remove the laravel installer files
        console.log('Removing Laravel install files from project root folder');
        fs.remove('laravel-installer', function(err) {
          if(err) {
            return console.log('Error removing Laravel installer dir from project root');
          }
        }); //fs.remove()

        cb();

      }); //fs.copy()

    }); //passthru()

  }); //this.fetch

}; //composer()

NpLaravelGenerator.prototype.laravelsetup = function composer() {

  console.log('Setting up Laravel');
  var cb = this.async();

  //Change the laravel environment detection settings in {APP_DIR}/bootstrap/start.php
  console.log("Changing Laravel's environment detection settings");
  var envSetting = this.read('_laravelfiles/bootstrap/_start.php', 'utf8');
  fs.readFile('bootstrap/start.php', 'utf8', function (err,data) {
    if (err) return console.log(err);

    var start = data.indexOf('$env = $app->detectEnvironment(array(');
    var end = data.indexOf('));', start);
    var replaceTarget = data.substring(start, end+3);
    var result = data.replace(replaceTarget, envSetting);

    fs.writeFile('bootstrap/start.php', result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  }); //fs.readFile()
     
  //add the AppComposer view composer to the App::before filter
  console.log("Adding AppComposer to App::before");
  var filterSetting = this.read('_laravelfiles/app/_filters.php', 'utf8');
  fs.readFile('app/filters.php', 'utf8', function (err,data) {
    if (err) return console.log(err);

    var start = data.indexOf('App::before(function($request)');
    var end = data.indexOf('});', start);
    var replaceTarget = data.substring(start, end+3);
    var result = data.replace(replaceTarget, filterSetting);

    fs.writeFile('app/filters.php', result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  }); //fs.readFile()

  /**
   * Copy boilerplate files and settings
   */
  //Create Laravel folders for the various view elements (layouts: basic layouts, pages: static pages, partials: small reusable elements, composers: classes run with each view)
  var dirs = ['layouts', 'pages', 'partials', 'composers'];
  dirs.forEach(function(dir) { 
    fs.mkdir('app/views/'+dir);
  });

  // Create webroot folders (css, js, etc)
  var dirs = ['scss', 'css', 'js', 'img', 'fonts'];
  dirs.forEach(function(dir) { 
    fs.mkdir('public/'+dir);
  });

  //remove Laravel's default hello.php page
  fs.removeSync('app/views/hello.php');

  //remove Laravel's homeController
  fs.removeSync('app/controllers/HomeController.php');

  //remove default routing file and replace with custom routing file
  fs.removeSync('app/routes.php');
  this.copy('_laravelfiles/app/_routes.php', 'app/routes.php'); 

  //copy default layout from templates
  this.copy('_laravelfiles/app/views/layouts/_default.blade.php', 'app/views/layouts/default.blade.php'); 

  //copy PagesController
  this.copy('_laravelfiles/app/controllers/_PagesController.php', 'app/controllers/PagesController.php'); 

  //copy PageController@index's view file
  this.copy('_laravelfiles/app/views/pages/_index.blade.php', 'app/views/pages/index.blade.php'); 

  //copy AppComposer
  this.copy('_laravelfiles/app/views/composers/_AppComposer.php', 'app/views/composers/AppComposer.php'); 

   //copy BaseModel and User
  this.copy('_laravelfiles/app/models/_BaseModel.php', 'app/models/BaseModel.php'); 
  fs.removeSync('app/models/User.php');
  this.copy('_laravelfiles/app/models/_User.php', 'app/models/User.php'); 

  //copy main css and scss
  this.copy('_laravelfiles/public/css/_style.css', 'public/css/style.css');
  this.copy('_laravelfiles/public/scss/_style.scss', 'public/scss/style.scss');  

  //copy main js
  this.copy('_laravelfiles/public/js/_app.js', 'public/js/app.js');
 
  //copy all the environments config files
  console.log('Copying NP Laravel config/environment settings');

  //copy local config
  fs.mkdir('app/config/development', function (err) {
    if (err) return console.log(err);  
    fs.copy('app/config/database.php', 'app/config/development/database.php');
  }); //fs.mkDir
  this.copy('_laravelfiles/app/config/development/_app.php', 'app/config/development/app.php'); 

  //remove laravel's readme's
  fs.removeSync('readme.md');
  fs.removeSync('contributing.md');

  //copy staging config  
  fs.mkdir('app/config/staging', function (err) {
    if (err) return console.log(err);
    fs.copy('app/config/database.php', 'app/config/staging/database.php');
  }); //fs.mkDir

  //copy production config
  fs.mkdir('app/config/production', function (err) {
    if (err) return console.log(err);
    fs.copy('app/config/database.php', 'app/config/production/database.php');
  }); //fs.mkDir

  //open the composer.json file and add the app/views/composers dir so all the viewcomposers are autoloaded
  fs.readFile('composer.json', 'utf8', function (err,data) {
    if (err) return console.log(err);

    var json = JSON.parse(data);
    
    json.autoload.classmap.push('app/views/composers');
    
    fs.writeFile('composer.json', JSON.stringify(json, null, 4), 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });

  console.log('Installing NPM modules');
  passthru("npm install", function (err, data) {
    if (err) return console.log(err);
    
  });

  //rebuild the autoloader
  console.log('Dumping and rebuilding the autoloader');
  passthru("php composer.phar dump-autoload", function (err, data) {
    if (err) return console.log(err);
    
  });

  cb();
};

NpLaravelGenerator.prototype.gitsetup = function gitsetup() {
  var cb = this.async();

  console.log('Setting up empty git repo');  
  passthru("git init", function (err, data) {
    if (err) return console.log(err);
  });

  cb();
  
}; //gitsetup()