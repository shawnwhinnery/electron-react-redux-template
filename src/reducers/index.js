var _ = require('lodash'),
	translate = require('translate')


var appControler ={
	UNDO: function(state, action) {
		const { past, present, future } = state
		const previous = past[past.length - 1]
		const newPast = past.slice(0, past.length - 1)
		return {
			past: newPast,
			present: previous,
			future: [ present, ...future ]
		}

	},
	REDO: function(state, action) {
		const { past, present, future } = state
		const next = future[0]
		const newFuture = future.slice(1)
		return {
			past: [ ...past, present ],
			present: next,
			future: newFuture
		}
	}
}


/*
	Exporiting a single reducer
*/
module.exports = function (state = {
		past: [],
		present: {
			navigation: {view: 'login'},
			form: [],
			auth: {
				isAuthenticating: false,
				isAuthenticated: false,
				email: undefined,
				username: undefined
			}
		},
		future: []
	}, action) {

	if(!appControler[action.type]) console.log(action)

	var newState = Object.assign({}, state),
		reducer = appControler[action.type]

	if(reducer) {
		newState.past = [...newState.past, newState.present]
		newState.present = reducer(newState.present, action)
		newState.future = []
	}

	console.log('--------------------------------')
	console.log(newState)
	console.log('--------------------------------')

	return newState

}
