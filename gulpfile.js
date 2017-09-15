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

	gulp.src(['index.html','result.php'])
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
		[ '<p', '<div style=\"color:#555;font-size:15px;line-height:1.7;margin-top:1em;margin-bottom:1.7em;\"' ],
		[ '</p>', '</div>' ],
		[ '<img ', '<img style=\"max-width:100%;\" ' ],		
		[ '<ul', '<div style=\"color:#555;font-size:15px;line-height:1.7;margin-top:.5em;margin-bottom:.5em;\"' ],
		[ '</ul>', '</div>' ],
		[ '<ol', '<div style=\"color:#555;font-size:15px;line-height:1.7;margin-top:.5em;margin-bottom:.5em;\"' ],
		[ '</ol>', '</div>' ],
		[ '<li>', '<div>- ' ],
		[ '</li>', '</div>' ],
		[ '<blockquote', '<blockquote style=\"border-left:4px solid #f60c3e; padding-left:.6em;\"' ],
		[ '<h1', '<div style=\"color:#333 !important;font-weight:700;font-size:1.25em;margin-top:3.5em;margin-bottom:.1em;font-family:Avenir Next,sans-serif;\"' ],
		[ '</h1>', '</div>' ],
		[ '<h2', '<div style=\"color:#333 !important;font-weight:700;font-size:1em;margin-top:2.5em;margin-bottom:.1em;font-family:Avenir Next,sans-serif;\"' ],
		[ '</h2>', '</div>' ]
	];
	
	gulp.src('Posts/HTML/*.html')
		.pipe(plugins.batchReplace(htmlTheme))
		.pipe(gulp.dest('posts/HTML/'));
	
 });


gulp.task('watch', function() {
	gulp.watch(['*','*/*'], ['default']);
 });