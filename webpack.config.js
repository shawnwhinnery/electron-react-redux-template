var path = require('path')
module.exports = {
	context: __dirname + "/src",
	entry: "./app.js",
	resolve: {
		root: [
			path.join(__dirname, 'node_modules'),
			path.join(__dirname, 'src')
		]
	},
	output: {
		devtoolLineToLine: true,
		path: __dirname + "/build",
		filename: "app.js"
	},
	module: {
		loaders: [{
			test: /.js?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: ['react']
			}
		}]
	}
}
