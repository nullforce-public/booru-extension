const gulp = require("gulp");
const fs = require("fs");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

function clean(cb) {
    if (fs.existsSync("dist")) {
        fs.rmSync("dist", { recursive: true });
    }
    cb();
}

function transpile(cb) {
    tsProject
        .src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest("dist"));
    cb();
}

function copyImages(cb) {
    gulp
        .src("src/images/**/*")
        .pipe(gulp.dest("dist/images"));
    cb();
}

function copyHtml(cb) {
    gulp
        .src("src/**/*.html")
        .pipe(gulp.dest("dist"));
    cb();
}

function copyCss(cb) {
    gulp
        .src("src/**/*.css")
        .pipe(gulp.dest("dist"));
    cb();
}

function copyJson(cb) {
    gulp
        .src("src/**/*.json")
        .pipe(gulp.dest("dist"));
    cb();
}

exports.default = gulp.series(
    clean,
    transpile,
    gulp.parallel(
        copyImages,
        copyHtml,
        copyCss,
        copyJson));

exports.clean = clean;
