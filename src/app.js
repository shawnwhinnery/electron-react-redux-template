var React = require('react'),
	ReactDOM = require('react-dom'),
	createStore = require('redux').createStore,
	combineReducers = require('redux').combineReducers,
	reducers = require('./reducers/index.js'),
	Home = require('views/Home'),
	Login = require('views/Login'),
	store = createStore(reducers)



class App extends React.Component {

	componentDidMount () {
		this.props.store.subscribe(function(){
			this.forceUpdate()
			return true
		}.bind(this))
	}

	render() {

		var state = this.props.store.getState(),
			views = {
				'login': <Login {...this.props} />,
				'home': <Home {...this.props} />
			}

		return views[state.present.navigation.view]

	}

}



/*
	Render the app
*/
function render () {

	var props = {
		store: store
	}

	ReactDOM.render(<App {...props}/>, document.body.querySelector('.main'))

}

window.APP = {
	init: function(){
		render()
	}
}
