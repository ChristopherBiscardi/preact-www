import ExtractTextPlugin from 'extract-text-webpack-plugin';

module.exports = function configure() {
  const ENV = process.env.NODE_ENV || 'development';
  const CSS_MAPS = ENV!=='production';
  const VENDORS = /\bbabel\-standalone\b/;

  config.loader('less-components', {
    test: /\.(less|css)$/,
    include: /src\/components\//,
    loader: ExtractTextPlugin.extract('style', [
      `css?sourceMap=${CSS_MAPS}&modules&importLoaders=1&localIdentName=[local]${process.env.CSS_MODULES_IDENT || '_[hash:base64:5]'}`,
      'postcss',
      `less?sourceMap=${CSS_MAPS}`
    ].join('!'))
  });

  config.loader('less-vendor', {
    test: /\.(less|css)$/,
    exclude: [/src\/components\//, VENDORS],
    loader: ExtractTextPlugin.extract('style', [
      `css?sourceMap=${CSS_MAPS}`,
      `postcss`,
      `less?sourceMap=${CSS_MAPS}`
    ].join('!'))
  });

  config.loader('raw', {
    test: /\.(xml|html|txt)$/,
    exclude: [/src\/index\.html$/],
    loader: 'raw'
  });

  config.plugin('extract-css',
                ExtractTextPlugin,
                ['style.[chunkhash].css', {
		  // leave async chunks using style-loader
		  allChunks: false,
		  disable: ENV!=='production'
		}]);

  config.merge(function(current) {
    if(!current.extensions.includes('less')) {
      current.extensions.push('less');
    }
    if(!current.extensions.includes('css')) {
      current.extensions.push('css');
    }
    if(!current.module.noParse) {
      current.module.noParse = [VENDORS];
    } else if(current.module.noParse) {
      current.module.noParse.push(VENDORS);
    }

    return current;
  });

  return config;
}
