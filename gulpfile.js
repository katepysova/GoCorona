import { path } from "./gulp.config.js";
import gulp from "gulp";
import { deleteAsync } from "del";

import webphtml from "gulp-webp-html";
import webp from "gulp-webp";

import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import gulpSass from "gulp-sass";
import sass from "sass";
const scss = gulpSass(sass);

import concat from "gulp-concat";

import browserSync from "browser-sync";
import newer from "gulp-newer";
import imagemin from "gulp-imagemin";
import sprite from "gulp-svg-sprite";

import gulpPages from "gulp-gh-pages";

import gulpif from "gulp-if";

import webpack from "webpack-stream";

const isBuild = process.env.NODE_ENV === "production";

const port = 3000;

const html = () =>
  gulp
    .src(path.src.html)
    .pipe(gulpif(isBuild, webphtml()))
    .pipe(gulp.dest(path.build.html));

const style = () => {
  return gulp
    .src(path.src.scss, { sourcemaps: !isBuild })
    .pipe(scss())
    .pipe(
      gulpif(
        isBuild,
        autoprefixer({
          overrideBrowserslist: ["last 10 version"],
          grid: "autoplace",
        })
      )
    )
    .pipe(concat("style.css"))
    .pipe(gulp.dest(path.build.css))
    .pipe(gulpif(isBuild, cleanCSS({ compatibility: "ie8" })))
    .pipe(concat("style.css"))
    .pipe(gulp.dest(path.build.css));
};

const js = () => {
  return gulp
    .src(path.src.js, { sourcemaps: !isBuild })
    .pipe(
      webpack({
        mode: isBuild ? "production" : "development",
        output: {
          filename: "script.js",
        },
      })
    )
    .pipe(gulp.dest(path.build.js));
};

const images = () => {
  return gulp
    .src(path.src.images)
    .pipe(newer(path.build.images))
    .pipe(gulpif(isBuild, webp()))
    .pipe(gulpif(isBuild, gulp.dest(path.build.images)))
    .pipe(gulpif(isBuild, gulp.src(path.src.images)))
    .pipe(gulpif(isBuild, newer(path.build.images)))
    .pipe(
      gulpif(
        isBuild,
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewbox: false }],
          interplaced: true,
          opimizationLevel: 3,
        })
      )
    )
    .pipe(gulp.dest(path.build.images))
    .pipe(gulp.src(path.src.svgImages))
    .pipe(gulp.dest(path.build.images));
};

const svgSprite = () => {
  const config = {
    mode: {
      symbol: true,
    },
  };

  return gulp
    .src(path.src.svg)
    .pipe(gulp.dest(`${path.build.svg}/svg`))
    .pipe(gulp.src(path.src.svg))
    .pipe(sprite(config))
    .pipe(concat("sprite.svg"))
    .pipe(gulp.dest(path.build.svg));
};

const reset = () => deleteAsync(path.clear);

const createGHPages = () => {
  return gulp
    .src(`${path.buildFolder}/**/*`, { allowEmpty: true })
    .pipe(gulpPages());
};

const watcher = () => {
  browserSync.init({
    server: {
      baseDir: path.buildFolder,
      index: "/index.html",
    },
    port: port || 3000,
  });
  gulp.watch(path.watch.html, html).on("change", browserSync.reload);
  gulp.watch(path.watch.scss, style).on("change", browserSync.reload);
  gulp.watch(path.watch.js, js).on("change", browserSync.reload);
  gulp.watch(path.watch.images, images).on("change", browserSync.reload);
  gulp.watch(path.watch.svg, svgSprite).on("change", browserSync.reload);
};

const mainTask = gulp.parallel(html, style, images, js);
const dev = gulp.series(reset, svgSprite, mainTask, watcher);
const build = gulp.series(reset, svgSprite, mainTask);
const deploy = gulp.series(build, createGHPages);

gulp.task("dev", dev);
gulp.task("build", build);
gulp.task("deploy", deploy);
gulp.task(svgSprite);
