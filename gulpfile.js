const {
	src,
	dest,
	parallel,
	watch
} = require('gulp');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const pug = require('gulp-pug');
const htmlbeautify = require('gulp-html-beautify');

const livereload = require('gulp-livereload');

function sassCompile () {
	return src('./src/sass/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(dest('./build/css'))
	.pipe(livereload());
}

function pugBuild () {
  return src('src/pug/*.pug')
  .pipe(pug())
	.pipe(htmlbeautify())
  .pipe(dest('build'))
  .pipe(livereload());
}

function jsCopy () {
  return src('src/js/*.js')
  .pipe(dest('build/js'))
  .pipe(livereload());
}

function phpCopy () {
  return src('src/php/*.php')
  .pipe(dest('build/php'))
  .pipe(livereload());
}

function track () {
	livereload.listen();
	watch(['src/sass/*.scss', 'src/sass/*/*.scss'], sassCompile);
	watch(['src/pug/*.pug', 'src/pug/*/*.pug'], pugBuild);
	watch(['src/js/*.js'], jsCopy);
	watch(['src/php/*.php'], phpCopy);
}

exports.sass = sassCompile;
exports.pug = pugBuild;
exports.js = jsCopy;
exports.php = phpCopy;
exports.watch = track;
exports.default = parallel(sassCompile, pugBuild, jsCopy, phpCopy, track); 
