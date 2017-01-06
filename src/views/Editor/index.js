var React = require('react'),
	translate = require('translate'),
	classname = require('classname'),
	two = require('2d')

/**
 *	@class Editor
 */
class Editor extends React.Component {

	getPresentState () {
		return this.props.store.getState().present
	}

	getProject () {

		var state = this.getPresentState(),
			project = state.editor.project

		return project

	}

	renderLayers () {

		var project = this.getProject()

		return project.layers.map(function(layer, i){
			return <div key={i}>{layer.name}</div>
		})

	}


	componentDidMount () {

		var project = this.getProject()

		this.setState({
			two: new two({
				container: this.refs.canvas,
				tiles: project.tiles,
				grid: {
					size: project.grid.size,
					dimensions: project.grid.dimensions
				},
				tileSize: [project.tileSize, project.tileSize]
			})
		})
	}

	/**
	 *	@method render
	 *	@memberof Editor
	 */
	render() {

		var className = {
			Editor:	true
		}

		return (
			<div className={classname(className)}>

				<div className="row flex left middle">

					<button className="inline">brush</button>

					<button className="inline">fill</button>

				</div>

				<div className="row">

					<div className="col-1-4">
						<h3>Layers</h3>
						{this.renderLayers()}
					</div>

					<div className="col-3-4" ref="canvas">
					</div>

				</div>

			</div>
		)
	}
}
module.exports = Editor
