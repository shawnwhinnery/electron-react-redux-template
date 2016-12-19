var strings = require('./strings.js'),
	_ = require('lodash')

module.exports = function(key, fallback){
	var translation = _.get(strings, key)
	if(translation) return translation
	return fallback
}
