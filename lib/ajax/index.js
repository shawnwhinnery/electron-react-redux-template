module.exports = function (url, cb) {

	var task = function(resolve){
		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) resolve(this.responseText)
		}
		xhttp.open("GET", url, true)
		xhttp.send()
	}

	if(cb) return task(cb)

	return task

}
