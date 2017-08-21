var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();
 
var cdnUrl = [
	[ '<link rel=\"stylesheet\" rev=\"stylesheet\" href=\"assets/fonts.css\" type=\"text/css\" media=\"all\" />', '' ],
	[ 'assets/', 'http://anyway-web.b0.upaiyun.com/anyway.post/' ]
];

var fontUrl = [
	[ 'fonts/', 'http://anyway-web.b0.upaiyun.com/anyway.post/' ]
];
 
gulp.task('default', function() {

	gulp.src(['index.html','*.php'])
		.pipe(plugins.fontSpider({ignore: ['assets/fonts.css']}));

	gulp.src(['*.html','*.php'])
		.pipe(plugins.batchReplace(cdnUrl))
		.pipe(gulp.dest('builds'));
		
	gulp.src('assets/fonts/*.*')
	        .pipe(gulp.dest('builds'));
	
	gulp.src('assets/*.svg')
	        .pipe(plugins.svgo())
	        .pipe(gulp.dest('builds'));
	
	gulp.src(['assets/*.css','!assets/*.min.css'])
		.pipe(plugins.concat('main.css'))
		.pipe(plugins.batchReplace(fontUrl))
		.pipe(plugins.cleanCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('builds'));     
});

gulp.task('md', function() {
	var mds = require('markdown-styles'),
	    path = require('path');
	
	mds.render(mds.resolveArgs({
	  input: path.normalize(process.cwd() + '/Posts/Markdown'),
	  output: path.normalize(process.cwd() + '/Posts/HTML'),
	  layout: path.normalize(process.cwd() + '/Posts/Theme'),
	}), function() {
	  console.log('All done!');
	});
	
	var htmlTheme = [
		[ '<a href', '<a style=\"color:#f60c3e !important;\" href' ],
		[ '<p', '<p style=\"color:#555 !important;font-size:14px;\"' ],
		[ '<li', '<li style=\"color:#555 !important;font-size:14px;\"' ],
		[ '<h1 ', '<h1 style=\"color:#333;font-weight:700 !important;font-size:1.5em;margin-top:2em;\" ' ]
	];
	
	gulp.src('Posts/HTML/*.html')
		.pipe(plugins.batchReplace(htmlTheme))
		.pipe(gulp.dest('posts/HTML/'));
	
 });


gulp.task('watch', function() {
	gulp.watch(['*','*/*'], ['default']);
 });