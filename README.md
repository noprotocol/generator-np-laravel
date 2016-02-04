# NoProtocol Laravel Generator

The *NoProtocol Laravel Generator* creates a project scaffolding for a Laravel project based on NoProtocol's best practices. This includes such features as:

* Complete Gulp build file (based on our own) [gulp-noprotocol](https://github.com/NoProtocol/gulp-noprotocol) library
* Automatic robots.txt based on environment setting
* Pre-defined SASS & JS structure

See the [features](#features) list to see them all.

## Installation

If you don't already have it installed, install [Yeoman](http://yeoman.io)

	npm install -g yo

Install the generator

	npm install -g generator-np-laravel

## Using the generator

Make a new directory, and `cd` into it:

	mkdir my-new-project && cd $_

Run `yo np-laravel` or simply `yo` and select the `Np Laravel` generator.

### Options:

* `--quick` Skip interaction and install app with defaults* and setup the database, create Git repository and install all Composer/NPM/Bower dependencies
* `--skipdbsetup` Skip the database setup
* `--skipdependencies` Skip installation of all the Composer/NPM/Bower dependencies
* `--force` Force installation even if the directory isn't empty

__\*__ Defaults are as follows:

* Projectname: __dirname__
* Project version: __1.0.0__
* Laravel version: __5.2__
* Setup database: __yes__
* Database credentials: __root/root__
* Database name: __projectname_ddb__
* Setup git repository: __yes__


*You can also see these options by running `yo np-laravel --help`.*

When the generator is finished, run `gulp` and you're done.

## Features:

### Laravel
Laravel `5.2`, `5.1.11`, `5.1.4`, `5.1` or `master`. See the [Laravel site](http://laravel.com/) for the various versions.

### Gulp
Build the app using [Gulp](http://gulpjs.com/) and our own [gulp-noprotocol](https://github.com/NoProtocol/gulp-noprotocol) (which takes care of bundling files, running sass etc).

Place all the app JS files outside the webroot in `resources/js`. The gulp process will bundle them into *app.min.js* in the `public/build/js` folder. If needed, extra JS libs can be placed anywhere and added to the gulp `bundle-libs` task. These will be bundled into *libs.min.js*

Place all the Sass files outside the webroot in `resources/sass`. The gulp process will bundle them into *app.js* in the `public/build/js` folder.

The gulp watch task also activates Livereload which is set to reload on changes to *.js* and *.css* files.

### Robots.txt
Due to repeated incidents in which staging server still allowed crawlers to access everything, the generator comes with `RobotsController.php`. On any Laravel environment other the production the output will be `Disallow: *`.

### .htaccess
The .htaccess file has been augmented with several settings taken from the [HTML5 boilerplate](https://github.com/h5bp/server-configs-apache/blob/master/dist/.htaccess) such as media types, security settings, gzip etc. The option to force HTTPS for one or more domains has also been added. See the file for more info.

### Splash page
A NoProtocol splash page on the index :)
