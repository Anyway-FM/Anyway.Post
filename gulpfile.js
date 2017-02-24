var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();
 
var cdnUrl = [
	[ 'build/', 'http://anyway-web.b0.upaiyun.com/anyway.post/' ]
];
 
gulp.task('default', function() {
	gulp.watch(['*','*/*'], ['build']);
 });
 
 
gulp.task('build', function() {

	gulp.src(['*.html','*.php'])
		.pipe(plugins.batchReplace(cdnUrl))
		.pipe(plugins.htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('build'));
		
	gulp.src(['css/*.css','!css/*.min.css'])
		.pipe(plugins.cleanCss({compatibility: 'ie8'}))
		.pipe(plugins.rename({
		      suffix: '.min'
		    }))
		.pipe(gulp.dest('build'));     
});

