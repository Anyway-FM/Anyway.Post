var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();
 
var cdnUrl = [
	[ '<link rel=\"stylesheet\" rev=\"stylesheet\" href=\"assets/fonts.css\" type=\"text/css\" media=\"all\" />', '' ],
	[ 'assets/', 'http://anyway-web.b0.upaiyun.com/anyway.post/' ]
];

var fontUrl = [
	[ 'fonts/', '' ]
];
 
gulp.task('default', function() {

	gulp.src(['index.html','*.php'])
		.pipe(plugins.fontSpider({ignore: ['assets/fonts.css']}));

	gulp.src(['*.html','*.php'])
		.pipe(plugins.batchReplace(cdnUrl))
//		.pipe(plugins.htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('build'));
		
	gulp.src('assets/fonts/*.*')
	        .pipe(gulp.dest('build'));
	
	gulp.src('*.svg')
	        .pipe(plugins.svgo())
	        .pipe(gulp.dest('build'));
	
	gulp.src(['assets/*.css','!assets/*.min.css'])
		.pipe(plugins.concat('main.css'))
		.pipe(plugins.batchReplace(fontUrl))
		.pipe(plugins.cleanCss({compatibility: 'ie8'}))
//		.pipe(plugins.rename({
//		      suffix: '.min'
//		    }))
		.pipe(gulp.dest('build'));     
});

gulp.task('watch', function() {
	gulp.watch(['*','*/*'], ['default']);
 });