const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const pngquant = require("imagemin-pngquant");

const paths = {
  assets: 'assets'
}

gulp.task('imagemin', () =>
	gulp.src(`${paths.assets}/**/*`)
		.pipe(
      imagemin(
        [
          pngquant({
            quality: '65-80',
            speed: 1,
            floyd: 0
          })
        ]
      )
    )
		.pipe(gulp.dest(paths.assets))
);
