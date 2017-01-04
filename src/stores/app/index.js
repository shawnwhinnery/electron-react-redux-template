var createStore = require('redux').createStore,
	combineReducers = require('redux').combineReducers,
	reducers = require('reducers/index.js')

module.exports = createStore(reducers)
