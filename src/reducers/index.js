var _ = require('lodash'),
	translate = require('translate'),
	database = require('stores/database')


var appControler ={
	UNDO: function(state, action) {
		const { past = [], present, future = [] } = state
		if (!past.length) return state
		const previous = _.clone(past[past.length - 1])
		const newPast = past.slice(0, past.length - 1)
		// console.log(previous.navigation.view)
		return {
			past: newPast,
			present: previous,
			future: [ present, ...future ]
		}

	},
	REDO: function(state, action) {
		const { past = [], present, future = [] } = state
		if (!future.length) return state
		const next = future[0]
		const newFuture = future.slice(1)
		return {
			past: [ ...past, present ],
			present: next,
			future: newFuture
		}
	},
	NAVIGATE: function(state, action){
		const { past = [], present, future = [] } = state

		// if unauthenticated
		var newView =  action.view

		return {
			past: [ ...past, present ],
			present: _.merge({}, present, {
				navigation: {
					view: newView
				}
			}),
			future: []
		}
	},
	LOGIN: function(state, action){
		const { past = [], present, future = [] } = state
		var projects = []

		database.select('users').where({email: action.email, password: action.password}).exec(function(user){

			user = user.data[0]

			database.select('projects').where({user: user.id}).exec(function(res){
				projects = res.data
			})

		})

		return {
			past: [ ...past, present ],
			present: _.merge({}, present, {
				projects: projects,
				auth: {
					id: 1,
					email: action.email,
					password: action.password,
					isAuthenticated: true,
					isAuthenticating: false
				}
			}),
			future: []
		}
	},
	OPEN_PROJECT: function(state, action){
		const { past = [], present, future = [] } = state

		database.select('swatches').where({id: action.project.swatches}).exec(function(res){
			action.project.swatches = res.data
		})

		return {
			past: [ ...past, present ],
			present: _.merge({}, present, {
				navigation: {
					view: 'editor'
				},
				editor: {
					project: action.project
				}
			}),
			future: []
		}
	},
	SELECT_SWATCH: function(state, action){
		const { past = [], present, future = [] } = state

		database.select('swatches').where({id: action.project.swatches}).exec(function(res){
			action.project.swatches = res.data
		})

		return {
			past: [ ...past, present ],
			present: _.merge({}, present, {
				editor: {
					swatch: action.swatch
				}
			}),
			future: []
		}
	},
	PAINT_TILE: function(state, action){
		const { past = [], present, future = [] } = state

		var nweTiles = _.clone(present.editor.project.tiles)

		//action.swatch
		//action.grid

		return {
			past: [ ...past, present ],
			present: _.merge({}, present, {
				editor: {
					project: {
						tiles: newTiles
					}
				}
			}),
			future: []
		}
	}
}


/*
	Exporiting a single reducer
*/
module.exports = function (state = {
		past: [],
		present: {
			navigation: {
				view: 'login'
			},
			auth: {
				isAuthenticating: false,
				isAuthenticated: false,
				email: undefined,
				password: undefined,
				sumonerName: undefined
			},
			project: {
				grid: {
					size: [32,32],
					dimensions: [64,64]
				},
				tiles: []
			}
		},
		future: []
	}, action) {

	var newState = JSON.parse(JSON.stringify(state)),
		reducer = appControler[action.type]

	if(reducer) {
		newState = reducer(newState, action)
	}

	// console.log(newState)

	console.log('--------------------------------')
	console.log(newState)
	console.log('--------------------------------')

	return newState

}
