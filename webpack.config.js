const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const AssetsManifest = require('webpack-assets-manifest');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	module: {
		rules: [
			{
				test: /\.m?js$/,
				loader: 'babel-loader',
				options: {
					sourceType: 'unambiguous',
					presets: [
						[
							'@babel/preset-env',
							{
								targets: {
          				ie: "11"
        				},
								useBuiltIns: 'entry',
								modules: false,
								corejs: 3
							}
						],
					]
				},
			},
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},

	entry: {
		app: './webpack/src/index.ts'
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
    }),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep']
		})
	]
};
