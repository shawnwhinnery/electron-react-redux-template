var React = require('react'),
	translate = require('translate'),
	classname = require('classname')

/**
 *	@class Users
 */
class Users extends React.Component {

/**
 *	@method render
 *	@memberof Users
 */
	render() {
		var className = {
			Users:	true
		}
		return (
			<div className={classname(className)}>Users</div>
		)
	}
}
module.exports = Users