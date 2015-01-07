var gulp    = require('gulp');
var Mincer  = require('mincer');
var mince   = require("gulp-mincer");
var env     = require("./mincer-env");

gulp.task('default', function() {
  gulp.src("assets/**/application.*")
    .pipe( mince(env) )
    .pipe( gulp.dest("assets") );
});
