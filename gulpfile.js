var gulp          = require('gulp');
var notify        = require('gulp-notify');
var source        = require('vinyl-source-stream');
var browserify    = require('browserify');
var babelify      = require('babelify');
var ngAnnotate    = require('browserify-ngannotate');
var browserSync   = require('browser-sync').create();
var rename        = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var uglify        = require('gulp-uglify');
var merge         = require('merge-stream');
var envify        = require('envify/custom');

// Where our files are located
var jsFiles   = "src/js/**/*.js";
var viewFiles = "src/views/**/*.html";
var styleFiles = "src/stylesheets/**/*.+(css|otf|eot|ttf|svg|woff|woff2)";

var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};


gulp.task('browserify', ['views'], function() {
  return browserify('./src/js/angularApp.js')
      .transform(babelify, {presets: ["es2015"]})
      .transform(envify()) // replaces process.env.XXX vars with their actual values
      .transform(ngAnnotate)
      .bundle()
      .on('error', interceptErrors)
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('browserifiedApp.js'))
      // Start piping stream to tasks!
      .pipe(gulp.dest('./build/'));
});

gulp.task('html', function() {
  return gulp.src("src/index.html")
      .on('error', interceptErrors)
      .pipe(gulp.dest('./build/'));
});

gulp.task('style', function() {
  return gulp.src(styleFiles)
      .on('error', interceptErrors)
      .pipe(gulp.dest('./build/stylesheets/'));
});

gulp.task('views', function() {
  return gulp.src(viewFiles)
      .pipe(templateCache({
        standalone: true
      }))
      .on('error', interceptErrors)
      .pipe(rename("app.templates.js"))
      .pipe(gulp.dest('./src/js/config/'));
});


// Groups the different things together:
gulp.task('build', ['html', 'style', 'views', 'browserify'], function() {
  // nothing to be done
});

// Builds & launches a server watching for changes
gulp.task('default', ['build'], function() {

  browserSync.init(['./build/**/**.**'], {
    server: "./build",
    port: 4000,
    notify: false,
    ui: {
      port: 4001
    }
  });

  gulp.watch("src/index.html", ['html']);
  gulp.watch(viewFiles, ['views']);
  gulp.watch(styleFiles, ['style']);
  gulp.watch(jsFiles, ['browserify']);
});

// Builds production ready minified JS files into the dist/ folder
gulp.task('heroku:production', ['build'], function() {
  var html = gulp.src('build/index.html')
                 .pipe(gulp.dest('./dist/'));

  var css = gulp.src("build/stylesheets/**/*.+(css|otf|eot|ttf|svg|woff|woff2)")
      .on('error', interceptErrors)
      .pipe(gulp.dest('./dist/stylesheets/'));

  var js = gulp.src("build/browserifiedApp.js")
               .pipe(uglify())
               .pipe(gulp.dest('./dist/'));


  return merge(html, css, js);
});