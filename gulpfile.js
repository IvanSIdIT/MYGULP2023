const { src, dest, watch, parallel, series } = require("gulp");

//SCSS/CSS
const autoprefixer = require("gulp-autoprefixer");
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");

function styles() {
  return src("app/scss/style.scss")
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 version"] }))
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

exports.styles = styles;

//JS

const uglify = require("gulp-uglify-es").default;

function scripts() {
  return src(["app/js/main.js"])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

exports.scripts = scripts;

//WATCHING

function watching() {
  watch(["app/scss/style.scss"], styles);
  watch(["app/js/main.js"], scripts);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

exports.watching = watching;

//BROWSERSYNC

const browserSync = require("browser-sync").create();

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

exports.browsersync = browsersync;

//BUILD + CLEAN

const clean = require("gulp-clean");

function building() {
  return src(["app/css/style.min.css", "app/js/main.min.js", "app/**/*.html"], {
    base: "app",
  }).pipe(dest("dist"));
}

function cleanDist() {
  return src("dist").pipe(clean());
}

exports.build = series(cleanDist, building);

exports.default = parallel(styles, scripts, browsersync, watching);
