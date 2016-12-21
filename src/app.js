var React = require('react'),
	ReactDOM = require('react-dom'),
	createStore = require('redux').createStore,
	combineReducers = require('redux').combineReducers,
	reducers = require('./reducers/index.js'),
	Home = require('views/Home'),
	store = createStore(reducers)


/*
	Render the app
*/
function render () {
	var props = {store: store}
	ReactDOM.render(<App {...props}/>, document.body.querySelector('.main'))
}

class App extends React.Component {

	render() {
		return (<Home {...this.props}/>)
	}

}

window.APP = {
	init: function(){
		render()
	}
}
