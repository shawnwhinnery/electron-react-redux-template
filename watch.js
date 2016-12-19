
var fs = require('fs'),
	concat = require('concat-files'),
	copyFile = require('./src/lib/copyFile/index.js'),
	run = require('./src/lib/run'),
	Job = require('./src/lib/job'),
	glob = require('glob'),
	lessFiles = [],
	jsFiles = [],
	buildingLess = false,
	buildLess = function(){

		if(buildLess) return

		buildLess = true

		concat(lessFiles, './build/style.less', function(err){
			run('lessc ./build/style.less ./build/style.css')
			buildLess = false
		})

	},
	jsBuilding = false,
	buildJs = function(resolve) {

		if(jsBuilding) return function () {resolve()}

		return function () {
			jsBuilding = true
			new Job([
				run('webpack . -d'),
				run('babel ./build/app.js --out-file ./build/app.js')
			], function(){
				jsBuilding = false
				resolve()
			})
		}

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
					resolve()
				})
			})
		}
	}


// (function(){
//
glob('./src/components/**/styles/*.less', function (err, files) {
	lessFiles.concat(files)
})

glob('./src/*.less', function (err, files) {
	lessFiles.concat(files)
})



// })()

// (function(){
glob('./src/app.js', function(err, files){
	jsFiles.concat(files)
})
glob('./src/views/**/*.js', function(err, files){
	jsFiles.concat(files)
})
glob('./src/components/**/*.js', function(err, files){
	jsFiles.concat(files)
})
// })()
fs.watch('./src/app.js', {encoding: 'buffer'}, function (eventType, filename) {
	console.log('js')
	new Job([
		buildJs,
		copyStaticAssets
	], function () {

	})
})
setTimeout(function () {
	// console.log(lessFiles, jsFiles)

	lessFiles.map(function (file) {
		fs.watch(file, {encoding: 'buffer'}, function (eventType, filename) {
			console.log('less')
			buildLess()
			copyStaticAssets()
		})
	})

	jsFiles.map(function(file){
		fs.watch(file, {encoding: 'buffer'}, function (eventType, filename) {
			console.log('js')
			buildJs()
			copyStaticAssets()
		})
	})

	buildLess()
	buildJs()
	copyStaticAssets()


}, 5000)



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
