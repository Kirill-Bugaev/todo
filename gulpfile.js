const {
	src,
	dest,
	parallel,
	watch
} = require('gulp');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const cleanCSS = require('gulp-clean-css');

const jsMinify = require('gulp-minify');

const pug = require('gulp-pug');
const htmlBeautify = require('gulp-html-beautify');

const livereload = require('gulp-livereload');

function sassBuild () {
	return src('./src/sass/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(dest('./build/css'))
	.pipe(livereload());
}

function sassFinal () {
	return src('./src/sass/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(dest('./final/css'))
	.pipe(livereload());
}

function pugBuild () {
	return src('src/pug/*.pug')
	.pipe(pug())
	.pipe(htmlBeautify())
	.pipe(dest('./build'))
	.pipe(livereload());
}

function pugFinal () {
	return src('src/pug/*.pug')
	.pipe(pug())
	.pipe(dest('./final'))
	.pipe(livereload());
}

function jsBuild () {
	return src('src/js/*.js')
	.pipe(dest('build/js'))
	.pipe(livereload());
}

function jsFinal () {
	return src('src/js/*.js')
	.pipe(jsMinify())
	.pipe(dest('./final/js'))
	.pipe(livereload());
}

function phpBuild () {
	return src('src/php/*.php')
	.pipe(dest('build/php'))
	.pipe(livereload());
}

function phpFinal () {
	return src('src/php/*.php')
	.pipe(dest('./final/php'))
	.pipe(livereload());
}

function track () {
	livereload.listen();
	watch(['src/sass/*.scss', 'src/sass/*/*.scss'], sassBuild);
	watch(['src/pug/*.pug', 'src/pug/*/*.pug'], pugBuild);
	watch(['src/js/*.js'], jsBuild);
	watch(['src/php/*.php'], phpBuild);
}

exports.sass = sassBuild;
exports.pug = pugBuild;
exports.js = jsBuild;
exports.php = phpBuild;
exports.watch = track;
exports.default = parallel(sassBuild, pugBuild, jsBuild, phpBuild, track); 
exports.final = parallel(sassFinal, pugFinal, jsFinal, phpFinal);
exports.build = parallel(sassBuild, pugBuild, jsBuild, phpBuild);
