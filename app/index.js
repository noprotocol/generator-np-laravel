/* global require, module, __dirname, setTimeout, process */
'use strict';
var passthru = require('passthru');
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs-extra');
var shell = require('shelljs');
var junk = require('junk');
var chalk = require('chalk');

// Base app settings
var settings = {
  appName: '',
  appVersion: '0.0.1',
  laravelVersion: 'v5.1.1',
  doDbSetup: true,
  dbUsername: 'root',
  dbPassword: 'root',
  dbName: '',
  doGitSetup: true,
  gitRemote: '',
  createAppKey: true
};

var errors = [];

var self = this;

// options for which laravel version to download
var laravelVersions = [settings.laravelVersion, 'v5.0.22', 'master'];

var NpLaravelGenerator = module.exports = function NpLaravelGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // skip interactive version and do everything automatic, assuming all the values to be correct
  this.option('quick', {'desc': 'skip interaction and install app, setup database, git and install Composer/NPM/Bower dependencies', 'defaults': false});

  // skip the db settings
  this.option('skipdbsetup', {'desc': 'Skip the database setup', 'defaults': false});

  // skip the dependencies installation  
  this.option('skipdependencies', {'desc': 'Skip installation of all the dependencies', 'defaults': false});  

  this.option('force', {'desc': 'Force installation if directory not empty', 'defaults': false});  

  fs.readJSON(path.join(__dirname, '../package.json'), function (err, data) {
    if (err) return console.error(err);
    self.pkg = data;
  });
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

/**
 * Pre install check & setup
 */
NpLaravelGenerator.prototype.preCheck = function () {
  var cb = this.async();
  var self = this;

  // check if the dir is empty (using 'junk') to skip OS files such as .DS_Store etc
  fs.readdir('.', function (err, files) {
    if(files.filter(junk.not).length > 0 && self.options.force === false) {

      // dir not empty and force install flag not used
      self.prompt([{
        type    : 'confirm',
        name    : 'forceInstall',
        message : 'The current directory ' +chalk.underline(process.cwd())+ ' is not empty. Continue?',
        default : false
      }], function(answers) {
        if(answers.forceInstall) {
          // force installation
          cb();    
        }
        // break install
        return;
      });
    } else {
      // dir empty or force install flag used, install
      cb();
    }
  });
};

/**
 * App configuration
 */
NpLaravelGenerator.prototype.configureApp = function () {
  var cb = this.async();

  this.log.write().info('App configuration');

  var self = this;

  if(this.options.skipdbsetup) {
    settings.doDbSetup = false;
  }

  if(this.options.quick) {
    settings.appName = this.appname;
    settings.dbName = this.appname + '_ddb';
    cb();
  }
  else {
    this.prompt([
      // General ap config question(s)
      {  
        type    : 'input',
        name    : 'appName',
        message : 'Project name',
        default : this.appname
      },
      {  
        type    : 'input',
        name    : 'appVersion',
        message : 'Project version',
        default : '0.0.1'
      },

      //Laravel package question(s)
      {
        type    : 'list',
        name    : 'laravelVersion',
        message : 'Which version of Laravel would you like to install? \n (' + settings.laravelVersion + ' is the last one tested/considered stable for this generator).',
        choices: laravelVersions,
        default : settings.laravelVersion
      },

      // DB setup (if needed) questions  
      {
        type    : 'confirm',
        name    : 'setupDB',
        message : 'Would you like to setup a database?',
        default : true
      },
      {
        when    : function(props) {
          return props.setupDB;
        },
        type    : 'confirm',
        name    : 'isRootUser',
        message : 'Are you using ' + ' root/root '.red + ' for database access?',
        default : true
      },
      {
        when    : function(props) {
          return !props.isRootUser && props.setupDB;
        },
        type    : 'input',
        name    : 'dbUsername',
        message : 'Database username',
        default : 'root' 
      },
      {
        when    : function(props) {
          return !props.isRootUser && props.setupDB;
        },
        type    : 'password',
        name    : 'dbPassword',
        message : 'Database password',
        default : 'root' 
      },
      {
        when    : function(props) {
          return props.setupDB;
        },
        type    : 'input',
        name    : 'dbName',
        message : 'Database name',
        default : function (props) {
          return props.appName  + '_ddb';
        }
      },

      // GIT setup (if needed) questions  
      {
        type    : 'confirm',
        name    : 'setupGit',
        message : 'Would you like to setup a git repository?',
        default : true
      },
      {
        when    : function(props) {
          return props.setupGit;
        },
        type    : 'input',
        name    : 'gitRemote',
        message : 'Git remote (leave empty for none)',
        default : ''
      }

    ], function(answers) {

        settings.appName =  answers.appName || settings.appName;
        settings.appVersion =  answers.appVersion || settings.appVersion;
        settings.laravelVersion =  answers.laravelVersion || settings.laravelVersion;
        settings.doDbSetup =  answers.doDbSetup || settings.doDbSetup;
        settings.dbUsername =  answers.dbUsername || settings.dbUsername;
        settings.dbPassword =  answers.dbPassword || settings.dbPassword;
        settings.dbName =  answers.dbName || settings.dbName;
        settings.doGitSetup =  answers.doGitSetup || settings.doGitSetup;
        settings.gitRemote =  answers.gitRemote || settings.gitRemote;  
        cb();  
    }); 
    
  }
};


/**
 * Download and extract Laravel
 */
NpLaravelGenerator.prototype.fetchLaravelApp = function () {
  var cb = this.async();
  
  this.log.write().ok('Downloading Laravel ' + settings.laravelVersion);

  //strip is needed to extract to current dir instead of dir with name of tarball
  this.tarball('https://github.com/laravel/laravel/archive/' + settings.laravelVersion + '.tar.gz', '.', {extract: true, strip: 1}, cb);
};

/**
 * Clean the default Laravel files which are unneeded/will be overwritten by our files
 */
NpLaravelGenerator.prototype.cleanLaravel = function () {
  this.log.write().ok('Removing default Laravel files');

  // use ignore and buld file
  fs.removeSync('.gitignore', logError);
  fs.removeSync('gulpfile.js', logError);  

  // use NP .htaccess file
  fs.removeSync('public/.htaccess', logError);

  // clean laravel docs
  fs.removeSync('readme.md', logError);

  // clean laravel views/controllers/routes etc
  fs.removeSync('app/views/hello.php', logError); 
  fs.removeSync('app/Http/Controllers/HomeController.php', logError); 
  fs.removeSync('app/Http/Controllers/WelcomeController.php', logError); 
  fs.removeSync('app/Http/routes.php', logError);

  // remove default less/bootstrap files
  fs.removeSync('resources/assets/less', logError);

  // css will be placed in build/css
  fs.removeSync('public/css', logError);

  // robots.txt will be handled by custom robots controller
  fs.removeSync('public/robots.txt', logError);

  // empty the fonts dir
  fs.emptydirSync('public/fonts', logError);

  // use NP package.json
  fs.removeSync('package.json', logError);

  // clear the default views (files and folders)
  var viewFiles = ['app.blade.php', 'home.blade.php', 'welcome.blade.php'];
  viewFiles.forEach(function(file) {
    fs.removeSync('resources/views/' + file, logError);
  });
};

/**
 * Copy all the package files for frontend development/build config
 */
NpLaravelGenerator.prototype.setupFrontendBuildConfig = function () {
  this.log.write().ok('Setting up frontend build config');

  fs.copy(__dirname + '/templates/_development/_package.json', 'package.json', logError);
  fs.copy(__dirname + '/templates/_development/_bower.json', 'bower.json', logError);
  fs.copy(__dirname + '/templates/_development/_.editorconfig', '.editorconfig', logError);
  fs.copy(__dirname + '/templates/_development/_.jshintrc', '.jshintrc', logError);
  fs.copy(__dirname + '/templates/_development/_gulpfile.js', 'gulpfile.js', logError);
  fs.copy(__dirname + '/templates/_development/_.gitignore', '.gitignore', logError);
};

/**
 * Create the folders for the public build/asset files
 */
NpLaravelGenerator.prototype.setupFrontendFiles = function () {
  this.log.write().ok('Setting up frontend files and directories');
  var self = this;

  fs.copy(__dirname + '/templates/_laravel/public/_.htaccess', './public/.htaccess', logError);
  fs.copy(__dirname + '/templates/_laravel/public/_favicon.ico', './public/favicon.ico', logError);
  fs.copy(__dirname + '/templates/_laravel/public/img/_noprotocol-logo.png', './public/img/noprotocol-logo.png', logError);

  // create webroot asset & dist folders (css, js, etc)
  var dirs = ['build', 'build/css', 'build/js', 'img'];
  dirs.forEach(function(dir) {
    fs.mkdir('public/' + dir, logError);
  });
};

/**
 * Copy and create all frontend asset files
 */
NpLaravelGenerator.prototype.setupAssets = function () {
  this.log.write().ok('Setting up assets files and directories');
  var self = this;

  // create sass folders
  var dirs = ['js', 'sass'];
  dirs.forEach(function(dir) {
    fs.mkdirs('resources/assets/' + dir, logError);
  });

  // copy base sass files
  fs.copy(__dirname + '/templates/_laravel/resources/assets/sass/_app.scss', 'resources/assets/sass/_app.scss', logError);
  fs.copy(__dirname + '/templates/_laravel/resources/assets/sass/_fonts.scss', 'resources/assets/sass/_fonts.scss', logError);
  fs.copy(__dirname + '/templates/_laravel/resources/assets/sass/_main.scss', 'resources/assets/sass/main.scss', logError);
  fs.copy(__dirname + '/templates/_laravel/resources/assets/sass/_mixins.scss', 'resources/assets/sass/_mixins.scss', logError);
  fs.copy(__dirname + '/templates/_laravel/resources/assets/sass/_reset.scss', 'resources/assets/sass/_reset.scss', logError);
  fs.copy(__dirname + '/templates/_laravel/resources/assets/sass/_utils.scss', 'resources/assets/sass/_utils.scss', logError);


  // copy base/placeholder app.js file
  fs.copy(__dirname + '/templates/_laravel/resources/assets/js/_app.js', 'resources/assets/js/app.js', logError);
};

/**
 * Setup the Laravel backend assets (views, etc)
 */
NpLaravelGenerator.prototype.setupBackendAssets = function () {
  this.log.write().ok('Setting up views and layout resources');
  var self = this;

  // create Laravel folders for the various view elements (layouts: basic layouts, partials: small reusable elements)
  var dirs = ['layouts', 'partials'];
  dirs.forEach(function(dir) {
    fs.mkdir('resources/views/' + dir, logError);
  });

  // copy default layout
  fs.copy(__dirname + '/templates/_laravel/resources/views/layouts/_default.blade.php', 'resources/views/layouts/default.blade.php', logError);
};

/**
 * Setup backend defaults (routes, default controller, splash page)
 */
NpLaravelGenerator.prototype.setupBackend = function () {
  this.log.write().ok('Setting up backend (routes, controllers, NoProtocol splash page, etc)');

  fs.copy(__dirname + '/templates/_laravel/app/Http/_routes.php', 'app/Http/routes.php', logError);
  fs.copy(__dirname + '/templates/_laravel/app/Http/Controllers/_PagesController.php', 'app/Http/Controllers/PagesController.php', logError); 
  fs.copy(__dirname + '/templates/_laravel/app/Http/Controllers/_RobotsController.php', 'app/Http/Controllers/RobotsController.php', logError); 
  fs.copy(__dirname + '/templates/_laravel/resources/views/_noprotocol.blade.php', 'resources/views/noprotocol.blade.php', logError);
};

/**
 * Setup documentation (haha...)
 */
NpLaravelGenerator.prototype.setupDocumentation = function () {
  this.log.write().ok('Setting up documentation');

  fs.copy(__dirname + '/templates/_laravel/docs/_readme.md', 'docs/readme.md', logError);
};

/**
 * Setup file rights
 */
NpLaravelGenerator.prototype.setupFileRights = function () {
  this.log.write().ok('Changing file rights');

  fs.chmod('storage', 0x777);
  ['app', 'logs', 'framework', 'framework/cache', 'framework/sessions', 'framework/views'].forEach(function(dir) {
    fs.chmod('storage/' + dir, 0x777, logError);
  });
};

/**
 * Patch the Bower settings 
 */
NpLaravelGenerator.prototype.patchBowerSettings = function () {
  this.log.write().ok('Patching bower.json');

  var cb = this.async();
  var self = this;
  
  fs.readJSON('./bower.json', function (err, data) {
    if(err) {
      logError(err);
    } 

    // overwrite the placeholder appname
    data.name = 'noprotocol/'+settings.appName;

    fs.removeSync('./bower.json', logError);
    fs.writeJSON('./bower.json', data, logError);

    cb();

  });
};

/**
 * Patch the NPM settings 
 */
NpLaravelGenerator.prototype.patchNpmSettings = function () {
  this.log.write().ok('Patching package.json');

  var cb = this.async();
  var self = this;
  
  fs.readJSON('./package.json', function (err, data) {
    if(err) {
      logError(err);
    } 

    // overwrite the placeholder appname
    data.name = settings.appName;

    fs.removeSync('./package.json', logError);
    fs.writeJSON('./package.json', data, logError);

    cb();

  });
};

/**
 * Patch Laravel's composer settings
 */
NpLaravelGenerator.prototype.patchComposerSettings = function () {
  this.log.write().ok('Patching composer.json');

  var cb = this.async();
  var self = this;
  
  fs.readJSON('./composer.json', function (err, data) {
    if(err) {
      logError(err);
    } 

    // delete items
    ['minimum-stability'].forEach(function (key) {
      delete data[key];
    });

    //update items
    data.require['laravel/framework'] = settings.laravelVersion.substring(1);
    data.name = 'noprotocol/'+settings.appName;
    data.description =  '';
    data.keywords = ['noprotocol', settings.appName, 'laravel'];
    data.license =  'Proprietary';
    data.authors = [{'name': 'NoProtocol', 'email': 'info@noprotocol.nl', 'homepage': 'http://noprotocol.nl'}],
    fs.removeSync('./composer.json', logError);
    fs.writeJSON('./composer.json', data, logError);

    cb();

  });
};


/**
 * Git repository setup
 */
NpLaravelGenerator.prototype.gitSetup = function () {
  var cb = this.async();
  var self = this;

  if(settings.doGitSetup) {
    this.log.write().ok('Setting up empty git repo');

    var git = shell.exec('git init', {silent:true});
   
    if (git.code !== 0) {
       //errors.push(git.output);
       logError(git.output);
    } else {
      if(settings.gitRemote !== '') {
        var remote = shell.exec('git remote add origin ' + settings.gitRemote);

        if (remote.code !== 0) {
          errors.push(remote.output);
        } else {
          this.log.write().ok('git remote added');
        }
      }
    } 
  }

  cb();
};

/**
 * Setup the development DB
 */
NpLaravelGenerator.prototype.setupDB = function () {
  var cb = this.async();
  var self = this;

  if(settings.doDbSetup && this.options.skipdbsetup === false) {
    this.log.write().ok('Setting up database '+settings.dbName);
  
    //var sql = 'mysql -u'+settings.dbUsername+' -p'+settings.dbPassword+' -e "create database '+settings.dbName+'"';
    var sql = 'MYSQL_PWD=' + settings.dbPassword + ' mysql -u'+settings.dbUsername+' -e "create database '+settings.dbName+'" --silent';

    // need to run this command using shelljs as using a password on the command line always causes a textfeed which passthru sees as an error
    var res = shell.exec(sql, {silent:true});
   
    if (res.code !== 0) {
       errors.push(res.output);
    }  
  } else {
    this.log.write().ok('Skipping database setup');
  } 
  cb(); 
};

/**
 * Install the composer dependencies
 */
NpLaravelGenerator.prototype.installComposerDependencies = function () {
  var cb = this.async();
  var self = this;

  if(this.options.skipdependencies === false) {
    this.log.write().ok('Installing PHP/Composer dependancies');
    // check if composer is installed globally
    var res = shell.exec('composer', {silent:true});
    if (res.code !== 0) {
       errors.push('Composer command not found. Please install the composer dependencies manually after the installer is done.');

      // laravel cant run without the composers deps, so don't autoset the app key at the end.
      settings.createAppKey = false;
      cb();
    } else {
      passthru("composer install", function (err, data) {
        if (err) {
           errors.push('Composer dependencies install error: ' + err);
        }
        cb();
      });
    }
  } else {
    this.log.write().ok('Skipping PHP/Composer dependencies');
    cb();
  }
};

/**
 * Install the NPM depencies
 */
NpLaravelGenerator.prototype.installNPMDependencies = function () {
  var cb = this.async();
  var self = this;
  
  if(this.options.skipdependencies === false) {
    this.log.write().ok('Installing NPM dependencies');

    // check if npm command is installed
    var res = shell.exec('npm -v', {silent:true});
    if (res.code !== 0) {
      errors.push('NPM command not found. Please install the Node dependencies manually after the installer is done.');
      cb();
    } else {

      var install = shell.exec('npm install', {silent:true});
      if (install.code !== 0) {
        errors.push('NPM dependencies install error: ' + install.output);
      } 
      cb();
    }
  } else {
    this.log.write().ok('Skipping NPM dependencies');
    cb();
  }
};

/**
 * Install bower dependencies
 */
NpLaravelGenerator.prototype.installBowerDependencies = function () {
  var cb = this.async();
  var self = this;
  
  // check if bower command is installed
  var res = shell.exec('bower -v', {silent:true});

  if(this.options.skipdependencies === false) {
    this.log.write().ok('Installing Bower dependencies');
    if (res.code !== 0) {
      errors.push('bower command not found. Please install the Bower dependencies manually after the installer is done.');
      cb();
    } else {
      var install = shell.exec('bower install', {silent:true});

      if (install.code !== 0) {
        errors.push('Bower dependencies install error: ' + install.output);
      } 
      cb();
    }
  } else {
    this.log.write().ok('Skipping Bower dependencies');
    cb();
  }
};

/**
 * Setup Laravel
 */
NpLaravelGenerator.prototype.setupLaravel = function () {
  this.log.write().ok('Setting up Laravel config');
  var self = this;
  var cb = this.async();
  
  // copy env file
  fs.rename('./.env.example', './.env', logError);

  // edit env file (environment, db, debug settings) 
  fs.readFile('./.env', 'utf8', function (err,data) {
    if (err) {
      errors.push('Cannot open .env file for editing.');
    }
  
    data = data.replace(/APP_ENV=local/g, 'APP_ENV=development');
    data = data.replace(/DB_DATABASE=homestead/g, 'DB_DATABASE='+settings.dbName);
    data = data.replace(/DB_USERNAME=homestead/g, 'DB_USERNAME='+settings.dbUsername);
    data = data.replace(/DB_PASSWORD=secret/g, 'DB_PASSWORD='+settings.dbPassword);

    fs.writeFile('./.env', data, 'utf8', function (err,data) {
      if (err) {
        errors.push('Error editing .env file with correct values.');
      }
    });
  });

  // php artisan create key
  var res = shell.exec('php artisan key:generate', {silent:true});
  if (res.code !== 0) {
      errors.push('Error generating app key.');
  } else {
    settings.createAppKey = false;
  }

  cb();
};

/**
 * Show completion screen with overview of post install commands, errors etc
 */
NpLaravelGenerator.prototype.completed = function () {
  var cb = this.async();
  var self = this;

  var installerErrors = (errors.length === 0)  ? chalk.green(0) : chalk.red(errors.length);

  this.log.write().ok('Installion completed with %s errors.', installerErrors); 
  
  if(errors.length !== 0) {
    errors.forEach(function(error) {
      self.log.write().conflict(error);
    });
  } 

  if(settings.createAppKey) {
    this.log.write().info('You still need to create an app key after manually installing the Composer dependencies');
  }
};

/**
 * Stack all error messages for later loggin
 * @param  String or Object An error string or node.fs error object passed through the callback
 * @return the error stack
 */
var logError = function(e) {
  if(e) {
    errors.push(e.toString());
  }

  return errors;
}