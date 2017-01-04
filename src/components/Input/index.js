var React = require('react'),
	translate = require('translate'),
	classname = require('classname')

/**
 *	@class Input
 */
class Input extends React.Component {

/**
 *	@method render
 *	@memberof Input
 */
	render() {
		var className = {
			Input:	true
		}
		return (
			<input className={classname(className)} {...this.props}/>
		)
	}
}
module.exports = Input
