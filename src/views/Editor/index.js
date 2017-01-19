var React = require('react'),
	translate = require('translate'),
	classname = require('classname'),
	two = require('2d')

/**
 *	@class Editor
 */
class Editor extends React.Component {

	getInitalState () {
		return {
			mouseDown: false,
			ctrlDown: false,
			shiftDown: false
		}
	}

	getApplicationState () {
		return this.props.store.getState().present
	}

	getProject () {
		var applicationState = this.getApplicationState(),
			project = applicationState.editor.project
		return project
	}

	renderLayerSelector () {
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

	renderSwatchSelector () {
		var project = this.getProject()
		return project.swatches.map(function(o,i){
			var setSwatch = function(){
				console.log('cat')
				this.props.store.dispatch({
					type: 'SELECT_SWATCH',
					id: o.id
				})
			}.bind(this)
			return <img src={o.imageData} key={i} onClick={setSwatch}/>
		}.bind(this))
	}

	componentDidMount () {
		var project = this.getProject(),
			T = new two({
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

		window.T = T

		this.setState({ two: T })

	}

	paint () {

		var applicationState = this.getApplicationState(),
			swatch = _.get(applicationState, 'editor.swatch'),
			layer = _.get(applicationState, 'editor.layer') || 0

		this.props.store.dispatch({
			type: 'PAINT_TILE',
			index: this.state.two.gridToIndex(this.state.two.mouse.grid),
			swatch: swatch,
			layer: layer
		})

	}

	onMouseDown () {
		var applicationState = this.getApplicationState()
		if(applicationState.editor.mouse.intent === 'paint') this.paint()

	}

	onMouseMove () {
		var applicationState = this.getApplicationState()
		if(applicationState.editor.mouse.intent === 'paint' && this.state.two.mouse.down) this.paint()
	}

	selectTranslateTool () {
		this.props.store.dispatch({
			type: 'SET_INTENT',
			intent: 'translate'
		})
	}

	selectPaintTool () {
		this.props.store.dispatch({
			type: 'SET_INTENT',
			intent: 'paint'
		})
	}


	/**
	 *	@method render
	 *	@memberof Editor
	 */
	render() {

		var className = {Editor:true},
			project = this.getProject(),
			applicationState = this.getApplicationState()

		// Sync the redux model with the two component
		if(this.state && this.state.two) {
			this.state.two.tiles = project.tiles
			this.state.two.mouse.intent = applicationState.editor.mouse.intent
		}

		return (
			<div className={classname(className)}>

				<div className="row fill-height">

					<div className="col-1-4">

						<h3>Tools</h3>
						<button onClick={this.selectTranslateTool.bind(this)}>Translate</button>
						<button onClick={this.selectPaintTool.bind(this)}>Paint</button>

						<h3>Layers</h3>
						{this.renderLayerSelector.bind(this)()}

						<h3>Swatches</h3>
						{this.renderSwatchSelector.bind(this)()}

					</div>

					<div className="col-3-4 canvas-container" ref="canvas" onClick={this.onMouseDown.bind(this)} onMouseMove={this.onMouseMove.bind(this)}>
					</div>

				</div>

			</div>
		)
	}
}
module.exports = Editor
