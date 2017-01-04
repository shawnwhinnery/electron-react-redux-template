var Jql = require('jql')

var database  = new Jql({
	champions: {
		columns: ["id","active","botEnabled","freeToPlay","botMmEnabled","rankedPlayEnabled"]
	}
})

module.exports = database
