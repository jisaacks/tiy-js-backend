var gulp    = require("gulp");
var Mincer  = require("mincer");
var mince   = require("gulp-mincer");
var rename  = require("gulp-rename");
var uglify  = require("gulp-uglify");
var minify  = require("gulp-minify-css");
var env     = require("./mincer-env");

var nodir = function(path) {
  path.dirname = "";
};

gulp.task("default", function() {
  gulp.src("assets/**/application.js")
    .pipe( mince(env) )
    .pipe( rename(nodir) )
    .pipe( uglify() )
    .pipe( gulp.dest("public/assets") );

  gulp.src("assets/**/application.css")
    .pipe( mince(env) )
    .pipe( rename(nodir) )
    .pipe( minify() )
    .pipe( gulp.dest("public/assets") );
});
