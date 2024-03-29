const webpack = require("webpack"),
	path = require("path");

let plugins = [
	new webpack.optimize.OccurrenceOrderPlugin(),
], devtool = false, watch = false;

if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
        // NODE_ENV: '"development"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      },
      uglifyOptions: {
		compress: {
			unsafe: true,
			inline: true,
			passes: 2,
			keep_fargs: false,
		},
		output: {
			beautify: false,
		},
		mangle: true,
	  },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}else{
	devtool = '#source-map'
	watch = true
}

module.exports = [{
	entry: {
		polyfill: "babel-polyfill",
		common: "./src/js/common.js",
		// special: "./src/js/special.js",
		// "special-switcher": "./src/ts/special-switcher.ts",
		// special: "./src/ts/special.ts"
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "./docs/js/"),
	},
	watch: watch,
	devtool: devtool,
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader",
				// exclude: /node_modules/,
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
				query: {
                  "presets": [
                    ["env", {
                      "loose": true,
                    }]
                  ],
                },
				exclude: /^.*node_modules((?!dom7|ssr-window|swiper).)*$/,
			},
			{
				test: /\.css$/,
				// loader: "css-loader",
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						options: {
							minimize: true,
						}
					}
				]
			}
		]
	},
	plugins: plugins
}];