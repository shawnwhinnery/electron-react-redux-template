var React = require('react'),
	translate = require('translate'),
	classname = require('classname')

/**
 *	@class Editor
 */
class Editor extends React.Component {

	renderLayers () {
		return this.props.store.getState().project.layers.map(function(layer){
			return <div>{layer.name}</div>
		})
	}

/**x`
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

					<div className="col-3-4">
						<h3>Layers</h3>
					</div>

				</div>

				<div className="row">
					<div className="col-auto-1">
						<h3>Swatches</h3>
					</div>
				</div>

			</div>
		)
	}
}
module.exports = Editor
