var React = require('react'),
	ReactDOM = require('react-dom'),
	Home = require('views/Home'),
	Users = require('views/Users'),
	store = require('stores/app'),
	database = require('stores/database'),
	api = require('api')

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
				'home': <Home {...this.props} />,
				'users': <Users {...this.props} />
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
