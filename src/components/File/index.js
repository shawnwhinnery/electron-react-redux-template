var React = require('react'),
	translate = require('translate'),
	classname = require('classname')

/**
 *	@class File
 */
class File extends React.Component {

/**
 *	@method render
 *	@memberof File
 */
	render() {
		var className = {
			File:	true
		}
		return (
			<div className={classname(className)}>File</div>
		)
	}
}
module.exports = File