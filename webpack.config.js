const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const AssetsManifest = require('webpack-assets-manifest');

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					plugins: ['syntax-dynamic-import'],
					presets: [
						[
							'@babel/preset-env',
							{
								targets: {
          				ie: 11
        				},
								modules: false
							}
						],
						'@babel/preset-typescript'
					]
				},
			},
		]
	},

	entry: {
		app: './webpack/index.ts'
	},

	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, './js')
	},

	resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/,
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	},

	plugins: [
		new AssetsManifest({
      output: path.resolve(__dirname, '_data', 'manifest.json')
    })
	]
};
