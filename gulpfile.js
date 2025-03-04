const { src, dest } = require('gulp');

/**
 * Copy the svg icon file to dist folder
 */
function buildIcons() {
	return src('nodes/**/*.svg').pipe(dest('dist/nodes'));
}

exports['build:icons'] = buildIcons; 