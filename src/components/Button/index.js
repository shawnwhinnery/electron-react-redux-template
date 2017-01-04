var React = require('react'),
	translate = require('translate'),
	classname = require('classname')

/**
 *	@class Button
 */
class Button extends React.Component {

/**
 *	@method render
 *	@memberof Button
 */
	render() {
		var props = _.merge({
				className: classname({Button:	true})
			}, this.props)
		return (
			<button {...props}></button>
		)
	}
}
module.exports = Button
