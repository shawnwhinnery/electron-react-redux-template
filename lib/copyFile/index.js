var fs = require('fs'),
	path = require('path')

function copyFile(source, target, cb) {
	console.log(source, '->', target)
	var task = function(resolve) {

	var targetPath = path.parse(target)
	if (!fs.existsSync(targetPath.dir)){
		fs.mkdirSync(targetPath.dir);
	}


	  var rd = fs.createReadStream(source);
	  rd.on("error", function(err) {
		  console.log(arguments)
		  resolve()
	  });


	  var wr = fs.createWriteStream(target);
	  wr.on("error", function(err) {
		  console.log(arguments)
	  });
	  wr.on("close", function(ex) {
		  console.log(arguments)
		  resolve()
	  });
	  rd.pipe(wr);


	}

	if(cb) return task(cb)

	return task


}

module.exports = copyFile
