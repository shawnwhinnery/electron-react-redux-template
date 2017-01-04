
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
				path.join(__dirname, 'src'),
				path.join(__dirname, 'lib')
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
				if (err) return console.log(err)
				less.render(file.toString(),{},
					function (e, output) {
						console.log(e)
						fs.writeFile('./build/style.css', output.css, function(){
							console.log('./build/style.css'.green, 'written')
							if (resolve) resolve()
						})
					});
			})
		})
		copyStaticAssets()
	},
	buildJs = function(resolve) {
		webpack(webpackConfig, function(err, stats) {
			if(err) console.log(err.red)
		    fs.readFile('./build/app.js', function(err, file){
				if(err) console.log(err.red)
				var result = babel.transform(file.toString(), {})
				fs.writeFile('./build/app.js', result.code, function(err, file){
					console.log('./build/app.js'.green, 'written')
					if (resolve) resolve()
				})
			})
		});
		copyStaticAssets()
	},
	copyStaticAssets = function(resolve){
		var copy = [
			copyFile(__dirname+'/src/index.js', __dirname+'/build/index.js'),
			copyFile(__dirname+'/src/index.html', __dirname+'/build/index.html'),
		]

		glob(__dirname+'/src/images/*', {}, function (err,files) {
			files.map(function (file) {
				copy.push(copyFile(file, file.replace('/src/', '/build/')))
			})
			new Job(copy, resolve)
		})


	}


new Job([
	globPromise('./src/**'),
	globPromise('./lib/**'),
], function(files){

	files = _.flattenDeep(files)

	lessFiles = files.filter(function(f){
		console.log('--------------')
		console.log(f)
		return (f.indexOf('.less') !== -1)
	})
	console.log("WATCHING",lessFiles.length,".less".purple,"files");
	watchFilesThen(lessFiles, buildLess)


	jsFiles = files.filter(function(f){return (f.indexOf(".js") !== -1)})
	console.log("WATCHING",jsFiles.length,".js".orange,"files");

	watchFilesThen(jsFiles, buildJs)



	buildLess()
	buildJs()

})

copyStaticAssets(function(){})
