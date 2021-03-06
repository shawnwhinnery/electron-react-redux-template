var React = require('react'),
	translate = require('translate'),
	classname = require('classname')

/**
 *	@class Home
 */
class Home extends React.Component {

	goLogin () {
		this.props.store.dispatch({
			type: 'NAVIGATE',
			view: 'login'
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
 *	@memberof Home
 */
	render() {

		var className = {
			Home:	true
		}

		return (
			<div className={classname(classname)}>
				<button onClick={this.goLogin.bind(this)}>go login</button>
				<button onClick={this.undo.bind(this)}>undo</button>
				<button onClick={this.redo.bind(this)}>redo</button>
			</div>
		)

	}
}
module.exports = Home
