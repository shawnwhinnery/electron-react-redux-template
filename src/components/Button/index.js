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
		var className = {
			'Button animated': true,
			'icon':( this.props.icon || this.props.exit),
			'infinite': this.props.icon,
			'bounce': this.props.bounce,
			'bounceOutDown': this.props.exit,
			'bounceInUp': (!this.props.exit && !this.props.icon),
		}
		return (
			<div className={classname(className)} {...this.props}>{this.props.children}</div>
		)
	}
}
module.exports = Button
