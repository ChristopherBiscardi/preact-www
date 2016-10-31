import OfflinePlugin from 'offline-plugin';

module.exports = function configure(config, {
  leo
}) {
  const ENV = process.env.NODE_ENV || 'development';
  if(ENV === 'production' && leo.pipeline === 'site') {
    config.plugin('dedupe', webpack.optimize.DedupePlugin);
    config.plugin('occuranceorder', webpack.optimize.OccurenceOrderPlugin);
    config.plugin('uglify', webpack.optimize.UglifyJsPlugin, {
      mangle: true,
      compress: { warnings: false },
      output: { comments:false }
    });
    config.plugin('offline', OfflinePlugin, {
      relativePaths: false,
      publicPath: '/',
      updateStrategy: 'all',
      version: 'hash',
      preferOnline: true,
      // updateStrategy: 'changed',
      safeToUseOptionalCaches: true,
      caches: {
	main: ['index.html', 'bundle.*.js', 'style.*.css'],
	additional: ['*.chunk.js', '*.worker.js', ...CONTENT],
	optional: [':rest:']
      },
      externals: [
	...CONTENT
      ],
      ServiceWorker: {
	navigateFallbackURL: '/',
	events: true
      },
      AppCache: {
	FALLBACK: { '/': '/' }
      }
      // rewrite /urls/without/extensions to /index.html
      //, rewrites(url) {
      // 	// if (!url.match(/\.[a-z0-9]{2,}(\?.*)?$/)) url = '/index.html';
      // 	if (!url.match(/\.[a-z0-9]{2,}(\?.*)?$/)) url = '/';
      // 	return url;
      // }
    })
  }
  return config;
}
