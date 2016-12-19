
var fs = require('fs'),
	path = require('path'),
	_ = require('lodash'),

	less = require('less'),
	babel = require("babel-core"),
	webpack = require("webpack"),

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
	colors = require('colors'),
	concat = require('concat-files'),
	copyFile = require('./lib/copyFile/index.js'),
	run = require('./lib/run'),
	Job = require('./lib/job'),
	glob = require('glob'),
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
							resolve()
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
					resolve()
				})
			})
			resolve()
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


// (function(){
//
new Job([
	globPromise('./src/components/**/styles/*.less'),
	globPromise('./src/*.less')
], function(files){
	lessFiles = _.flattenDeep(files)
	watchFilesThen(lessFiles, buildLess)
})

new Job([
	globPromise('./src/*.js'),
	globPromise('./src/views/**/*.js'),
	globPromise('./src/components/**/*.js')
], function(files){
	jsFiles = _.flattenDeep(files)
	watchFilesThen(jsFiles, buildJs)
})

copyStaticAssets(function(){})

// })()

// (function(){


// })()
// fs.watch('./src/app.js', {encoding: 'buffer'}, function (eventType, filename) {
// 	console.log('js')
// 	new Job([
// 		buildJs,
// 		copyStaticAssets
// 	], function () {
//
// 	})
// })
// setTimeout(function () {
// 	// console.log(lessFiles, jsFiles)
//
// 	lessFiles.map(function (file) {
// 		fs.watch(file, {encoding: 'buffer'}, function (eventType, filename) {
// 			console.log('less')
// 			buildLess()
// 			copyStaticAssets()
// 		})
// 	})
//
// 	jsFiles.map(function(file){
// 		fs.watch(file, {encoding: 'buffer'}, function (eventType, filename) {
// 			console.log('js')
// 			buildJs()
// 			copyStaticAssets()
// 		})
// 	})
//
// 	buildLess()
// 	buildJs()
// 	copyStaticAssets()
//
//
// }, 5000)



// function watchJS(error, files){
// 	files.map(function (file) {
//
// 		fs.watch(file, {encoding: 'buffer'}, function (eventType, filename)  {
//
// 			if(building) return console.log(eventType)
//
// 			building = true
//
// 			console.log('build started')
//
// 			// Create webpack bundle
// 			// -----------------------------------------------------------------------
// 			run('webpack . -d')
//
// 			// Copy static assets
// 			// -----------------------------------------------------------------------
// 			copyFile('./src/index.html', './build/index.html')
//
// 			copyFile('./src/index.js', './build/index.js')
//
// 			glob('./src/images/*', {}, function (err,files) {
// 				files.map(function (file) {
// 					copyFile(file, file.replace('/src/', '/build/'))
// 				})
// 			})
//
//
// 			run('babel ./build/app.js --out-file ./build/app.js')
//
//
// 		});
//
// 	})
// }



// #create webpack bundle in the build folder (app.js)
// webpack .
//
// #copy static assets to the build folder
// cp ./src/index.html ./build/index.html
// cp ./src/index.js ./build/index.js
// cp -r ./src/images ./build
//
// #concat .less files and write them to the build folder
// cat ./src/general.less ./src/components/**/styles/*.less ./src/views/**/styles/*.less > ./build/style.less
//
// #compile the concatonated file
// lessc ./build/style.less ./build/style.css
//
// #transpile the
// babel ./build/app.js --out-file ./build/app.js
//
// ## delete the .less file
// rm -rf ./build/style.less
