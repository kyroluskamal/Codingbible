var gulp = require('gulp');
var gzip = require('gulp-gzip');
var brotli = require('gulp-brotli');
const zlib = require("zlib");

gulp.task('gzipApp', function () {
    return gulp.src(['./dist/browser/*.*'])
        .pipe(gzip())
        .pipe(gulp.dest('./dist/browser'));
});
gulp.task('gzipServer', function () {
    return gulp.src(['./dist/server/*.*'])
        .pipe(gzip())
        .pipe(gulp.dest('./dist/server'));
});
gulp.task('brotliApp', function () {
    return gulp.src(['./dist/browser/*.*'])
        .pipe(brotli.compress({
            extension: 'br',
            skipLarger: true,
            // the options are documented at https://nodejs.org/docs/latest-v10.x/api/zlib.html#zlib_class_brotlioptions 
            params: {
                // brotli parameters are documented at https://nodejs.org/docs/latest-v10.x/api/zlib.html#zlib_brotli_constants
                [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            },
        }))
        .pipe(gulp.dest('./dist/browser'));
});
gulp.task('brotliServer', function () {
    return gulp.src(['./dist/server/*.*'])
        .pipe(brotli.compress({
            extension: 'br',
            skipLarger: true,
            // the options are documented at https://nodejs.org/docs/latest-v10.x/api/zlib.html#zlib_class_brotlioptions 
            params: {
                // brotli parameters are documented at https://nodejs.org/docs/latest-v10.x/api/zlib.html#zlib_brotli_constants
                [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            },
        }))
        .pipe(gulp.dest('./dist/server'));
});