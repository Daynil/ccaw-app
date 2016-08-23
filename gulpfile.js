'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const tsc = require('gulp-typescript');
const tsProjectFront = tsc.createProject('tsconfig.json');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const del = require('del');

/********** Development Builds **********/

gulp.task('serve', ['compile-ts', 'compile-scss', 'copy-untransformed'], () => {
  nodemon({script: './server/server.js'});

  gulp.watch(
        ['./src/**/*.ts',
         './src/**/*.scss',
         './src/**/*.html',
         './src/**/*.js' ], ['src-watch']);

});

gulp.task('src-watch', ['compile-ts', 'compile-scss', 'copy-untransformed']);

gulp.task('compile-scss', () => {
  let sourceScssFiles = [
    './src/**/*.scss'
  ];

  let scssResult = gulp
    .src(sourceScssFiles)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError));

  let stream = scssResult
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));

  return stream;
});

gulp.task('compile-ts', () => {
  let sourceTsFiles = [
    './src/**/*.ts',			    // Path to typscript files
    './typings/index.d.ts' 		// Reference to typings so tsc knows where it is
  ];

  let tsResult = gulp
    .src(sourceTsFiles)
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProjectFront));

  let stream = tsResult
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));

  return stream;
});

gulp.task('clean', () => {
  return del(['./dist']);
});


/** Copy untransformed files to destination folder */
gulp.task('copy-untransformed', () => {
  let sourceFiles = [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.css',
    './public/**/*.*'
  ];

  let stream = gulp
    .src(sourceFiles)
    .pipe(gulp.dest('./dist'));

  return stream;
});

/********** Production Builds **********/

gulp.task('build-production', ['compile-ts-prod', 'compile-scss-prod', 'copy-untransformed']);

gulp.task('compile-scss-prod', () => {
  let sourceScssFiles = [
    './src/**/*.scss'
  ];

  let scssResult = gulp
    .src(sourceScssFiles)
    .pipe(sass().on('error', sass.logError));

  let stream = scssResult
    .pipe(gulp.dest('./dist'));

  return stream;
});

gulp.task('compile-ts-prod', () => {
  let sourceTsFiles = [
    './src/**/*.ts',			      // Path to typscript files
    './typings/index.d.ts'	  	// Reference to typings so tsc knows where it is
  ];

  let tsResult = gulp
    .src(sourceTsFiles)
    .pipe(tsc(tsProjectFront));

  let stream = tsResult
    .pipe(gulp.dest('./dist'));

  return stream;
});