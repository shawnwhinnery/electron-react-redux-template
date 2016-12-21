
var fs = require('fs'),
	path = require('path'),
	_ = require('lodash'),

	less = require('less'),
	babel = require("babel-core"),
	webpack = require("webpack"),

	colors = require('colors'),
	concat = require('concat-files'),
	copyFile = require('./lib/copyFile/index.js'),
	run = require('./lib/run'),
	Job = require('./lib/job'),
	glob = require('glob'),

	webpackConfig = {
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
	},
	lessConfig = {
		paths: ['.', './lib'],  // Specify search paths for @import directives
		filename: 'style.less', // Specify a filename, for better error messages
		compress: true          // Minify CSS output
	},
	lessFiles = [],
	jsFiles = [],
	buildingLess = false,
	jsBuilding = false,
	building = {},
	watchFilesThen = function(files, changeHandler) {

		var handlerId = 'b-'+(1 + Math.round(Math.random() * 10000000000000000))

		files.map(function(file){
			fs.watch(file, {encoding: 'buffer'}, function (eventType, filename)  {

				if(building[handlerId] === true) return console.log('rejecting build'.red, handlerId)
				console.log('Building:', handlerId)
				building[handlerId] = true

				changeHandler(function(){
					console.log('Building complete:', handlerId)
					building[handlerId] = false
				})

			})
		})
	},
	globPromise = function(path){
		return function(resolve){
			glob(path, function (err, files) {
				resolve(files)
			})
		}
	},
	buildLess = function(resolve){
		concat(lessFiles, './build/style.less', function(err){
			fs.readFile('./build/style.less', function (err, file) {
				less.render(file.toString(),{},
					function (e, output) {
						fs.writeFile('./build/style.css', output.css, function(){
							console.log('./build/style.css'.green, 'written')
							if (resolve) resolve()
						})
					});
			})
		})
	},
	buildJs = function(resolve) {
		webpack(webpackConfig, function(err, stats) {
		    fs.readFile('./build/app.js', function(err, file){
				var result = babel.transform(file.toString(), {})
				fs.writeFile('./build/app.js', result.code, function(err, file){
					console.log('./build/app.js'.green, 'written')
					if (resolve) resolve()
				})
			})
		});
	},
	copyStaticAssets = function(resolve){
		return function() {
			new Job([
				copyFile('./src/index.html', './build/index.html'),
				copyFile('./src/index.js', './build/index.js')
			], function(){
				glob('./src/images/*', {}, function (err,files) {
					files.map(function (file) {
						copyFile(file, file.replace('/src/', '/build/'))
					})
					if (resolve) resolve()
				})
			})
		}
	}


new Job([
	globPromise('./src/components/**/styles/*.less'),
	globPromise('./src/*.less')
], function(files){
	lessFiles = _.flattenDeep(files)
	watchFilesThen(lessFiles, buildLess)
	buildLess()
})

new Job([
	globPromise('./src/*.js'),
	globPromise('./src/reducers/*.js'),
	globPromise('./src/reducers/**/*.js'),
	globPromise('./src/views/**/*.js'),
	globPromise('./src/components/**/*.js')
], function(files){
	jsFiles = _.flattenDeep(files)
	watchFilesThen(jsFiles, buildJs)
	buildJs()
})

copyStaticAssets(function(){})
