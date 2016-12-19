var React = require('react'),
	ReactDOM = require('react-dom'),
	createStore = require('redux').createStore,
	combineReducers = require('redux').combineReducers,
	actions = require('actions'),
	reducers = require('./reducers/index.js'),
	Home = require('views/Home'),
	store = createStore(reducers)


/*
	Render the app
*/
function render () {
	var props = {model: store.getState().present, store: store, dispatch: dispatch}
	ReactDOM.render(<App {...props}/>, document.body.querySelector('.main'))
}



class App extends React.Component {

	render() {
		return (
			<div>
				<Home {...this.props}/>
			</div>
		)
	}
}

window.APP = {
	init: function(){
		render()
	}
}
