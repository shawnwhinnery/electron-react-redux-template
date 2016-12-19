
var exec = require('child_process').exec

function run (cmd, cb) {

	var task = function(resolve){

		exec(cmd, {cwd:__dirname},function (error, stdout, stderr) {

		  if (error) {
			console.error('exec error: '+error.toString());
			return resolve(error.toString());
		  }

		  if(stdout) {
			  console.log('stdout'+stdout.toString());
			  return resolve(stdout.toString());
		  }

		  if(stderr) {
			  console.log('stderr:'+stderr.toString());
			  return resolve(stderr.toString());
		  }

		});

	}

	if(cb) return task(cb)

	return task

}

module.exports = run
