var React = require('react'),
	ReactDOM = require('react-dom'),
	Home = require('views/Home'),
	Login = require('views/Login'),
	Editor = require('views/Editor'),
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
				'login': <Login {...this.props} />,
				'home': <Home {...this.props} />,
				'editor': <Editor {...this.props} />
			}

		return views[state.present.navigation.view]

	}

}



/*
	Render the app
*/
function render () {



	database.select('projects').exec(function(projects){

		var props = {
			store: store,
			projects: projects.data || []
		}


		ReactDOM.render(<App {...props}/>, document.body.querySelector('.main'))
	})


}





window.APP = {
	init: function(){
		render()
	}
}
