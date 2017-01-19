//Lets require/import the HTTP module
var http = require('http'),
	fs = require('fs');

//Lets define a port we want to listen to
var PORT=1337,
	INDEX = './build/index.html';

//We need a function which handles requests and send response
function handleRequest(req, res){

	console.log(req.url)

	var file = (req.url === '/') ? INDEX : './build'+req.url

	fs.readFile(file, function(err, data){

		if(err) return res.end('', 404)

		if(typeof data === 'string') return res.end(data)

		if(typeof data.toString === 'function') return res.end(data.toString())

	})

}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
