const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const AssetsManifest = require('webpack-assets-manifest');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
			},
			{
				test: /\.css$/,
				use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
			},
			{
				test: /\.(ttf|eot|woff|woff2|svg|png|jpg|gif|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader'
			}
		]
	},

	entry: {
		app: './webpack/src/index.ts'
	},

	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, './assets/bundle')
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
		}),
		new MiniCssExtractPlugin({filename: '[name].[chunkhash].css'}),
	]
};
