var fs = require('fs')

function copyFile(source, target, cb) {

  var task = function(resolve) {
	  var cbCalled = false;

	  var rd = fs.createReadStream(source);
	  rd.on("error", function(err) {
		done(err);
	  });
	  var wr = fs.createWriteStream(target);
	  wr.on("error", function(err) {
		done(err);
	  });
	  wr.on("close", function(ex) {
		done();
	  });
	  rd.pipe(wr);

	  function done(err) {
		resove()
		if (!cbCalled && cb) {
		  cb(err);
		  cbCalled = true;
		}
	  }
	}

}

module.exports = copyFile
