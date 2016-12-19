// import Input from './components/Input'
var React = require('react'),
	ReactDOM = require('react-dom'),
	createStore = require('redux').createStore,
	combineReducers = require('redux').combineReducers,
	actions = require('actions'),
	// reducers = combineReducers(require('reducers.js')),
	reducers = require('./reducers/index.js'),
	Input = require('components/Input'),
	Refresh = require('components/Refresh'),
	Header = require('components/Header'),
	Login = require('views/Login'),
	Vote = require('views/Vote'),
	Lobby = require('views/Lobby'),
	Home = require('views/Home'),
	store = createStore(reducers)

store.dispatch({type: 'NAVIGATE_LOGIN'})

/*
	Render the app
*/
function render () {
	var props = {model: store.getState().present, store: store, dispatch: dispatch}
	ReactDOM.render(<App {...props}/>, document.body.querySelector('.main'))
}


/*
	Wrapper that lets me re-render after dispatching an event
*/
function dispatch (msg) {
	store.dispatch(msg)
	render()
}




class App extends React.Component {

	navigate () {
		var state = this.props.store.getState()
		console.log(state.navigation.view)
		if(state.navigation.view === 'login') return <Login {...this.props}/>
		if(state.navigation.view === 'lobby') return <Lobby {...this.props}/>
		if(state.navigation.view === 'vote') return <Vote {...this.props}/>
		if(state.navigation.view === 'home') return <Home {...this.props}/>
	}

	render() {
		console.log(this.props.store.getState());
		return (
			<div>
				{this.navigate()}
			</div>
		)
	}
}

window.APP = {
	init: function(){
		render()
	}
}
