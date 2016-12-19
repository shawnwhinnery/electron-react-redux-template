var React = require('react'),
	translate = require('translate'),
	classname = require('classname')

/**
 *	@class Home
 */
class Home extends React.Component {

/**
 *	@method render
 *	@memberof Home
 */
	render() {
		var className = {
			Home:	true
		}
		return (
			<div className={classname(classname)}>Home</div>
		)
	}
}
module.exports = Home