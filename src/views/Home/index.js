var React = require('react'),
	translate = require('translate'),
	classname = require('classname'),
	database = require('stores/database')

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

	renderProjects () {
		return this.props.projects.map(function(project, i){

			var onClick = function() {
				database.select('projects')
				.where({id:project.id})
				.exec(function(res){
					this.props.store.dispatch({
						type: 'OPEN_PROJECT',
						project: res.data[0]
					})
				}.bind(this))

			}.bind(this)

			return <div key={i} onClick={onClick}>{project.name}</div>

		}.bind(this))
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
				<h1>Projects</h1>
				{this.renderProjects()}
				<button>Create Project</button>
				<button onClick={this.goLogin.bind(this)}>go login</button>
			</div>
		)

	}
}
module.exports = Home
