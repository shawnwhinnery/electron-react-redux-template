var React = require('react'),
	translate = require('translate'),
	Button = require('components/Button'),
	Form = require('components/Form'),
	Circle = require('components/Circle')

/**
 *	@class Lobby
 */
class Lobby extends React.Component {

/**
 *	@method render
 *	@memberof Lobby
 */
	render() {

		var formProps = {
			store: this.props.store
		}

		return (
			<div className='Lobby'>
				lobby
			</div>
		)
	}
}
module.exports = Lobby
