/**
 * Watch and handle workflow automation tasks.
 *
 * @author Louis Young
 * @version 1.2.0
 * @licence MIT
 */

// Dependencies
const gulp = require("gulp");
const babel = require("gulp-babel");
const sass = require("gulp-sass");
const eslint = require("gulp-eslint");
const sassLint = require("gulp-sass-lint");
const htmlLint = require("gulp-html-lint");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const del = require("del");
const zip = require("gulp-zip");
const log = require("fancy-log");
const colour = require("ansi-colors");
const browserSync = require("browser-sync").create();

// Directory paths.
const paths = {
  src: "../public/src/",
  dist: "../public/dist/",
  package: ["../public/dist/**.**", "../public/dist/**/*"]
};

// Logger icons.
const icons = {
  success: "✓",
  warn: "⚠",
  info: "ℹ"
};

// Production mode.
let production = false;

/**
 * Compile Sass.
 */

const compileStyles = () => {
  log.info(colour.blue(`${icons.info} Styles compiled`));

  return gulp
    .src(`${paths.src}stylesheets/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(
      sassLint({
        configFile: ".sass-lint.json"
      })
    )
    .pipe(sassLint.format())
    .pipe(
      sass({
        outputStyle: "compressed",
        errLogToConsole: true,
        includePaths: `${paths.src}stylesheets`
      })
    )
    .on("error", sass.logError)
    .pipe(autoprefixer())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${paths.dist}stylesheets/`))
    .pipe(browserSync.stream());
};

gulp.task("compileStyles", compileStyles);

/**
 * Compile scripts.
 */

const compileScripts = () => {
  log.info(colour.blue(`${icons.info} Scripts compiled`));

  const stream = gulp.src(`${paths.src}scripts/*.js`);
  stream
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(eslint(".eslintrc.json"))
    .pipe(eslint.format());

  if (production) {
    stream.pipe(terser());
    stream.pipe(
      babel({
        presets: ["@babel/env"]
      })
    );
  }

  stream
    .pipe(concat("main.js"))
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${paths.dist}scripts/`));

  const vendorStream = gulp.src(`${paths.src}scripts/vendor/*.js`);
  vendorStream.pipe(plumber()).pipe(sourcemaps.init());

  if (production) {
    vendorStream.pipe(terser());
  }

  return vendorStream
    .pipe(concat("vendor.js"))
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${paths.dist}scripts/vendor/`));
};

gulp.task("compileScripts", compileScripts);

/**
 * Compile HTML.
 */

const compileMarkup = () => {
  log.info(colour.blue(`${icons.info} Markup compiled`));

  return gulp
    .src(`${paths.src}*.html`)
    .pipe(plumber())
    .pipe(
      htmlLint({
        htmllintrc: ".html-lintrc.json",
        useHtmllintrc: true
      })
    )
    .pipe(htmlLint.format())
    .pipe(gulp.dest(`${paths.dist}`));
};

gulp.task("compileMarkup", compileMarkup);

/**
 * Optimize static assets.
 */
const compressAssets = () => {
  log.info(colour.blue(`${icons.info} Assets optimised`));

  return gulp
    .src(`${paths.src}assets/**/*`)
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.jpegtran({
          progressive: true
        }),
        imagemin.optipng({
          optimizationLevel: 5
        }),
        imagemin.gifsicle({
          interlaced: true
        })
      ])
    )
    .pipe(gulp.dest(`${paths.dist}assets/`));
};

gulp.task("compressAssets", compressAssets);

/**
 * Lint Sass.
 */

const lintStyles = () => {
  return gulp
    .src(`${paths.src}stylesheets/**/*.scss`)
    .pipe(plumber())
    .pipe(
      sassLint({
        configFile: ".sass-lint.json"
      })
    )
    .pipe(sassLint.format());
};

gulp.task("lintStyles", lintStyles);

/**
 * Lint scripts.
 */

const lintScripts = () => {
  return gulp
    .src(`${paths.src}scripts/**.*`)
    .pipe(plumber())
    .pipe(eslint(".eslintrc.json"))
    .pipe(eslint.format());
};

gulp.task("lintScripts", lintScripts);

/**
 * Lint HTML.
 */

const lintMarkup = () => {
  return gulp
    .src(`${paths.src}*.html`)
    .pipe(
      htmlLint({
        htmllintrc: ".html-lintrc.json",
        useHtmllintrc: true
      })
    )
    .pipe(htmlLint.format());
};

gulp.task("lintMarkup", lintMarkup);

/**
 * Clean the distributable directory.
 */

const clean = () => {
  log.info(colour.green(`${icons.success} Build directory cleaned`));
  return del(`${paths.dist}**`, {
    force: true
  });
};

gulp.task("clean", clean);

/**
 * Clean the assets directory.
 */

const cleanAssets = () => {
  return del(`${paths.dist}/assets/**`, {
    force: true
  });
};

gulp.task("cleanAssets", cleanAssets);

/**
 * Launch a development server.
 */

const server = () => {
  browserSync.init({
    server: paths.dist,
    notify: false,
    scrollProportionally: false,
    logLevel: "silent"
  });

  log.info(colour.green(`${icons.success} Starting the development server...`));
  log("");
};

gulp.task("server", server);

/**
 * Compile all files.
 */

const compile = callback => {
  if (production) {
    log("");
    log.info(colour.green(`${icons.success} Production version built`));
  }
  callback();
};

gulp.task(
  "compile",
  gulp.series(
    "clean",
    gulp.parallel([
      "compileMarkup",
      "compileStyles",
      "compileScripts",
      "compressAssets"
    ]),
    compile
  )
);

/**
 * Build all files for production.
 */

const build = callback => {
  production = true;
  callback();
};

gulp.task("build", gulp.series(build, "compile"));

/**
 * Lint all JavaScript, Sass and HTML.
 */

const lint = callback => {
  log.info(colour.green(`${icons.success} Linted`));
  callback();
};

gulp.task(
  "lint",
  gulp.parallel(gulp.parallel([lintStyles, lintScripts, lintMarkup]), lint)
);

/**
 * Create an archive of production build files.
 */

const compress = () => {
  log.info(colour.green(`${icons.success} Production build packaged`));

  return gulp
    .src(paths.package)
    .pipe(plumber())
    .pipe(zip("build.zip"))
    .pipe(gulp.dest("../"));
};

gulp.task("compress", compress);

gulp.task("package", gulp.series(["build", "compress"]));

/**
 * Reload browser.
 */

const reload = callback => {
  browserSync.reload();
  callback();
};

/**
 * Stream changes to browser.
 */

const stream = callback => {
  browserSync.stream();
  callback();
};

/**
 * Watch source files & static assets for changes.
 */

const watch = () => {
  gulp.watch(`${paths.src}*.html`, gulp.series(compileMarkup, reload));
  gulp.watch(
    `${paths.src}stylesheets/**/*.scss`,
    gulp.series(compileStyles, stream)
  );
  gulp.watch(`${paths.src}scripts/**`, gulp.series(compileScripts, reload));
  gulp.watch(
    `${paths.src}assets/**`,
    gulp.series(cleanAssets, compressAssets, reload)
  );

  if (!production) {
    log.info(
      colour.yellow(
        `${icons.warn} Note that the development build is not optimised`
      )
    );
    log("");
  }
  log.info(colour.green(`${icons.success} Watching changes...`));
  log("");
};

gulp.task("watch", watch);

gulp.task("start", gulp.parallel("server", "watch", "compile"));
