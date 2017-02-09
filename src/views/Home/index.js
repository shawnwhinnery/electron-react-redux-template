var React = require('react'),
	translate = require('translate'),
	classname = require('classname'),
	Button = require('components/Button')

/**
 *	@class Home
 */
class Home extends React.Component {

	/**
	 *	@method createUsers
	 *	@memberof Home
	 */
	createUsers () {
		this.props.store.dispatch({
			type: "NAVIGATE",
			view: 'users'
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
				<Button onClick={this.createUsers.bind(this)}>
					Create User
				</Button>
			</div>
		)

	}
}
module.exports = Home
