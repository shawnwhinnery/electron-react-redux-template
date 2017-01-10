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
			var onClick = function(){
				this.props.store.dispatch({
					type: 'SELECT_LAYER',
					layer: i
				})
			}.bind(this)

			return <div key={i} onClick={onClick}>{layer.name}</div>
		}.bind(this))

	}

	renderSwatches () {

		var project = this.getProject()

		return project.swatches.map(function(o,i){
			var setSwatch = function(){
				this.props.store.dispatch({
					type: 'SELECT_SWATCH',
					id: o.id
				})
			}.bind(this)
			return <img src={o.imageData} key={i} onClick={setSwatch}/>
		}.bind(this))
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
				tileSize: [project.tileSize, project.tileSize],
				tiles: project.tiles,
				layers: project.layers,
				swatches: project.swatches
			})
		})
	}

	onClick () {

		var presentState = this.getPresentState(),
			swatch = _.get(presentState, 'editor.swatch'),
			layer = _.get(presentState, 'editor.layer') || 0

		this.props.store.dispatch({
			type: 'PAINT_TILE',
			index: this.state.two.gridToIndex(this.state.two.mouse.grid),
			swatch: swatch,
			layer: layer
		})

	}

	/**
	 *	@method render
	 *	@memberof Editor
	 */
	render() {

		var className = {Editor:true},
			project = this.getProject()

		if(this.state && this.state.two) this.state.two.tiles = project.tiles

		return (
			<div className={classname(className)}>

				<div className="row fill-height">

					<div className="col-1-4">

						<h3>Layers</h3>
						{this.renderLayers.bind(this)()}

						<h3>Swatches</h3>
						{this.renderSwatches.bind(this)()}

					</div>

					<div className="col-3-4 canvas-container" ref="canvas" onClick={this.onClick.bind(this)}>
					</div>

				</div>

			</div>
		)
	}
}
module.exports = Editor
