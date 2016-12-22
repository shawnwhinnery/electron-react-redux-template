var React = require('react'),
	translate = require('translate'),
	classname = require('classname')

/**
 *	@class Login
 */
class Login extends React.Component {

	goHome () {
		this.props.store.dispatch({
			type: 'NAVIGATE',
			view: 'home'
		})
	}

	undo () {
		this.props.store.dispatch({
			type: 'UNDO'
		})
	}

	redo () {
		this.props.store.dispatch({
			type: 'REDO'
		})
	}

/**
 *	@method render
 *	@memberof Login
 */
	render() {
		var className = {
			Login:	true
		}
		return (
			<div className={classname(classname)}>
				<button onClick={this.goHome.bind(this)}>go home</button>
				<button onClick={this.undo.bind(this)}>undo</button>
				<button onClick={this.redo.bind(this)}>redo</button>
			</div>
		)
	}
}
module.exports = Login
