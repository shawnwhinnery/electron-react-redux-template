var Jql = require('jql')

var database  = new Jql({
	users: {
		columns: ["id","name", "email", "password"]
	},
	projects: {
		columns: ["id","name", "layers"]
	}
})


database.insert({id: 1, email: 'shawnsdrive@gmail.com', password: 'password'}).exec(function () {})
database.insert([
	{
		id:1,
		user: 1,
		name: 'Test 1',
		height: 2048,
		width: 2048,
		layers: [
			{name: 'layer 1'},
			{name: 'layer 3'},
			{name: 'layer 4'},
			{name: 'layer 5'}
		]
	},
	{
		id:2,
		user: 1,
		name: 'Test 2',
		height: 2048,
		width: 2048,
		layers: [
			{name: 'layer 1'}
		]
	},
	{
		id:3,
		user: 1,
		name: 'Test 3',
		height: 2048,
		width: 2048,
		layers: []
	}
]).into('projects').exec(function(){
	console.log('bootstrapped projects')
})

module.exports = database
