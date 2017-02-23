var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();
 
gulp.task('default', function() {
	gulp.watch(['*','*/*'], ['build']);
 });
 
gulp.task('build', ['watch'], function() {
  return gulp.src(['css/*.css','!css/*.min.css'])
    .pipe(plugins.cleanCss({compatibility: 'ie8'}))
    .pipe(plugins.rename({
          suffix: '.min'
        }))
    .pipe(gulp.dest('css'));
    
   return gulp.src(['assets/*.svg','!assets/*.min.svg'])
           .pipe(plugins.svgmin())
           .pipe(plugins.rename({
                 suffix: '.min'
               }))
           .pipe(gulp.dest('assets'));
});

gulp.task('watch', function () {
   gulp.start('build');
});