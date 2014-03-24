'use strict';
require('colors');
var passthru = require('passthru');
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs-extra');

var NpLaravelGenerator = module.exports = function NpLaravelGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    //this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(NpLaravelGenerator, yeoman.generators.Base);

NpLaravelGenerator.prototype.animateLogo = function () {
  var cb = this.async();
  this.log.write();
  var count = 35;
  var no = '\r   NO'.bold;
  var protocol = 'PROTOCOL'.magenta.bold;
  var self = this;
  var animate = function () {
    self.log.write(no + (new Array(count).join(' ')) + protocol + ':// '.bold);
    count--;
    if (count === 0) {
      setTimeout(function () {
        self.log.write(no + protocol + ';// ');
        setTimeout(function () {
          self.log.write(no + protocol + ':// '.bold);
          setTimeout(function () {
            self.log.write('\n\n');
            cb();
          }, 200);
        }, 500);
      }, 250);
    } else {
      setTimeout(animate, 5 + (30 - (count * 2)));
    }
  };
  animate();
};

NpLaravelGenerator.prototype.fetchLaravelApp = function () {
  var cb = this.async();
  this.log.write().info('Downloading Laravel');
  this.tarball('https://github.com/laravel/laravel/archive/master.tar.gz', '.', cb);
}

NpLaravelGenerator.prototype.frontendSetup = function () {
  this.log.write().info('Setting up frontend tools')
  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.copy('_.editorconfig', '.editorconfig');
  this.copy('_.jshintrc', '.jshintrc');
  this.copy('_.htaccess', '.htaccess');
  this.copy('_gulpfile.js', 'gulpfile.js');
  this.copy('_.bowerrc', '.bowerrc');
  fs.removeSync('.gitignore');
  this.copy('_gitignore', '.gitignore');
};


NpLaravelGenerator.prototype.patchLaravel = function () {
  var self = this;
  this.log.write().info('Patching Laravel');
  var composer = JSON.parse(this.readFileAsString('composer.json'));
  ['name', 'description', 'keywords', 'license', 'minimum-stability'].forEach(function (key) {
    delete composer[key];
  });
  // @todo Add sledgehammer  "sledgehammer/laravel": "dev-master"
  //    composer.autoload.classmap.push('app/views/composers');
  fs.removeSync('composer.json');
  this.write('composer.json', JSON.stringify(composer, null, 2));


  //Change the laravel environment detection settings in {APP_DIR}/bootstrap/start.php
  var envSetting = this.read('_laravelfiles/bootstrap/_start.php', 'utf8');
  fs.readFile('bootstrap/start.php', 'utf8', function (err,data) {
    if (err) return console.log(err);

    var start = data.indexOf('$env = $app->detectEnvironment(array(');
    var end = data.indexOf('));', start);
    var replaceTarget = data.substring(start, end + 3);
    var result = data.replace(replaceTarget, envSetting);

    fs.writeFile('bootstrap/start.php', result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });

  //add the AppComposer view composer to the App::before filter
//  this.log.write().info("Adding AppComposer to App::before");
//  var filterSetting = this.read('_laravelfiles/app/_filters.php', 'utf8');
//  fs.readFile('app/filters.php', 'utf8', function (err,data) {
//    if (err) return console.log(err);
//
//    var start = data.indexOf('App::before(function($request)');
//    var end = data.indexOf('});', start);
//    var replaceTarget = data.substring(start, end+3);
//    var result = data.replace(replaceTarget, filterSetting);
//
//    fs.writeFile('app/filters.php', result, 'utf8', function (err) {
//      if (err) return console.log(err);
//    });
//  });

  /**
   * Copy boilerplate files and settings
   */
  //Create Laravel folders for the various view elements (layouts: basic layouts, pages: static pages, partials: small reusable elements, composers: classes run with each view)
  var dirs = ['layouts', 'pages', 'partials'];
  dirs.forEach(function(dir) {
    fs.mkdir('app/views/' + dir);
  });

  // Create webroot folders (css, js, etc)
  var dirs = ['sass', 'css', 'js', 'img', 'fonts'];
  dirs.forEach(function(dir) {
    fs.mkdir('public/' + dir);
  });

  fs.removeSync('app/views/hello.php'); //remove Laravel's default hello.php page
  fs.removeSync('app/controllers/HomeController.php'); //remove Laravel's homeController

  //remove default routing file and replace with custom routing file
  fs.removeSync('app/routes.php');
  this.copy('_laravelfiles/app/_routes.php', 'app/routes.php');
  this.copy('_laravelfiles/app/views/layouts/_default.blade.php', 'app/views/layouts/default.blade.php'); //copy default layout from templates
  this.copy('_laravelfiles/app/controllers/_PagesController.php', 'app/controllers/PagesController.php'); //copy PagesController
  this.copy('_laravelfiles/app/views/pages/_index.blade.php', 'app/views/pages/index.blade.php'); //copy PageController@index's view file
//  this.copy('_laravelfiles/app/views/composers/_AppComposer.php', 'app/views/composers/AppComposer.php');  //copy AppComposer

   //copy BaseModel and User
//  this.copy('_laravelfiles/app/models/_BaseModel.php', 'app/models/BaseModel.php');
//  fs.removeSync('app/models/User.php');
//  this.copy('_laravelfiles/app/models/_User.php', 'app/models/User.php');

  //copy sass
  this.copy('_laravelfiles/public/sass/_main.scss', 'public/sass/main.scss');
  this.copy('_laravelfiles/public/sass/__utilities.scss', 'public/sass/_utilities.scss');
  this.copy('_laravelfiles/public/sass/__base.scss', 'public/sass/_base.scss');

  //copy main js
  //this.copy('_laravelfiles/public/js/_app.js', 'public/js/app.js');

  //copy all the environments config files

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
  });

  //copy production config
  fs.mkdir('app/config/production', function (err) {
    if (err) return console.log(err);
    fs.copy('app/config/database.php', 'app/config/production/database.php');
    self.copy('_laravelfiles/app/config/production/_app.php', 'app/config/production/app.php');
  });

};

NpLaravelGenerator.prototype.allDependancies = function () {
  var cb = this.async();
  var self = this;
  this.log.write().info('Installing PHP dependancies via Composer');
  this.fetch('https://getcomposer.org/composer.phar', 'composer.phar', function (err) {
    if (err) throw err;
    passthru("php composer.phar up", function (err, data) {
      if (err) throw err;
      fs.remove('composer.phar');
      self.installDependencies({callback:cb}); // bower and npm dependancies
    });
  });
};

NpLaravelGenerator.prototype.fileRights = function () {
  fs.chmod('app/storage', 0x777);
  ['cache', 'logs', 'meta', 'sessions', 'views'].forEach(function(dir) {
    fs.chmod('app/storage/' + dir, 0x777);
  });
}

NpLaravelGenerator.prototype.gitSetup = function () {
  var cb = this.async();

  this.log.write().info('Setting up empty git repo');
  passthru("git init", function (err, data) {
    if (err) return console.log(err);
    cb();
  });
};

NpLaravelGenerator.prototype.compileCss = function () {
//  var cb = this.async();
//  passthru("grunt compass:development", cb);
}

NpLaravelGenerator.prototype.completed = function () {
  this.log.write().ok('NoProtocol Laravel Generator is complete! Time to run ' + 'gulp'.bold);
}