var _ = require('lodash'),
	translate = require('translate')


var defaultState = {
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
}



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
module.exports = function (state = defaultState, action) {

	if(!appControler[action.type]) console.log(action)

	var newState = Object.assign({}, state),
		reducer = appControler[action.type]

	if(reducer) {
		newState.past = [...newState.past, newState.present]
		newState.present = reducer(newState.present, action)
		newState.future = []
	}

	console.log('--------------------------------')
	console.log(action, newPresent, state)
	console.log('--------------------------------')

	return newState

}

// function navigation (state = {view: 'login'}, action) {
// 	if(action.type === 'NAVIGATE_LOGIN') return {view: 'login'}
// 	if(action.type === 'NAVIGATE_LOBBY') return {view: 'lobby'}
// 	if(action.type === 'NAVIGATE_HOME') return {view: 'home'}
// 	return Object.assign({},state)
// }
//
// module.exports.navigation = navigation
//
//
// function form (state = [], action) {
//
// 	if(action.type === 'SET_FORM_VALUE') {
//
// 		var newState = state.slice(0)
//
// 		for(let i = 0; i < newState.length; i++)
// 			if(newState[i].name === action.name) {
// 				newState[i].value = action.value
// 			}
//
// 		return newState
//
// 	}
//
// 	if(action.type === 'NAVIGATE_LOGIN') {
// 		return [
// 				{
// 					label: translate('Email', 'Email'),
// 					placeholder: translate('Email', 'Email'),
// 					value: '',
// 					type: 'email',
// 					name: 'email'
// 				},
// 				{
// 					label: translate('Password', 'Password'),
// 					placeholder: translate('Password', 'Password'),
// 					value: '',
// 					type: 'password',
// 					name: 'password'
// 				}
// 			]
// 	}
//
// 	if(action.type === 'LOGIN_SUCCESSFUL') return  []
//
// 	return state
//
// }
// module.exports.form = form
//
//
// function auth (state = {isAuthenticating: false,isAuthenticated: false,email: undefined,username: undefined}, action) {
//
// 	if(action.type === 'ATTEMPT_LOGIN') {
// 		return {
// 			isAuthenticating: true,
// 			isAuthenticated: false,
// 			email: action.email,
// 			password: action.password
// 		}
// 	}
//
// 	if(action.type === 'LOGIN_SUCCESSFUL') {
// 		return {
// 			isAuthenticating: false,
// 			isAuthenticated: true,
// 			email: state.email,
// 			password: state.password,
// 			username: action.username
// 		}
// 	}
//
// 	return state
//
// }
// module.exports.auth = auth
