var gulp    = require('gulp');
var Mincer  = require('mincer');
var mince   = require("gulp-mincer");
var rename  = require("gulp-rename");
var env     = require("./mincer-env");

var nodir = function(path) {
  path.dirname = "";
};

gulp.task('default', function() {
  gulp.src("assets/**/application.*")
    .pipe( mince(env) )
    .pipe( rename(nodir) )
    .pipe( gulp.dest("public/assets") );
});
