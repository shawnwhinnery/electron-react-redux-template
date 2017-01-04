
var ajax = require('ajax'),
	job = require('job'),
	database = require('stores/database'),
	API_KEY = 'd9cf3d99-e81e-49a4-8eee-c6a11d285c02',
	API_HOST = 'https://na.api.pvp.net/',
	SUMONER = API_HOST+'/api/lol/na/v1.4/summoner/by-name/{name}?api_key='+API_KEY
	CHAMPION = API_HOST+'/api/lol/na/v1.2/champion/{id}?api_key='+API_KEY
	CHAMPIONS = API_HOST+'/api/lol/na/v1.2/champion?api_key='+API_KEY

var api = function(){

	this.getSumoner = function(name, cb){
		var task = function(resolve){ajax(SUMONER.replace('{name}', name), resolve)}
		if(cb) return task(cb)
		return task
	}

	this.getChampion = function(id, cb){
		var task = function(resolve){ajax(CHAMPION.replace('{id}', id), resolve)}
		if(cb) return task(cb)
		return task
	}

	this.getChampions = function(cb){
		var task = function(resolve){ajax(CHAMPIONS, resolve)}
		if(cb) return task(cb)
		return task
	}

	this.getTestData = this.getChampions

}

module.exports = new api()
