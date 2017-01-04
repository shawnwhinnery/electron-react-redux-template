var _ = require('lodash'),
	translate = require('translate')


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
		var newView = (!present.auth.sumonerName) ? 'login' : action.view

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
		console.log(action)
		return {
			past: [ ...past, present ],
			present: _.merge({}, present, {
				auth: {
					sumonerName: action.sumonerName,
					email: action.email,
					password: action.password,
					isAuthenticated: true,
					isAuthenticating: false
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
