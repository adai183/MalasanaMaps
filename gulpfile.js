var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

gulp.task('default', ['styles', 'copy-html', 'copy-images'], function() {
	gulp.watch('css/**/*.css', ['styles']);
	gulp.watch('./index.html', ['copy-html']);
	gulp.watch('/img/*', ['copy-images']);
	gulp.watch('./dist/index.html').on('change', browserSync.reload);
	gulp.watch('./js/*').on('change', browserSync.reload);
	
	browserSync.init({
		server: './'
	});
});

gulp.task('scripts-dist', function() {
	gulp.src('js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('copy-html', function() {
	gulp.src('./index.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
	gulp.src('img/*')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function() {
	gulp.src('css/**/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('lint', function () {
	return gulp.src(['js/**/*.js'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failOnError last.
		.pipe(eslint.failOnError());
});