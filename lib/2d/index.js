
var _ = require('lodash'),
	database = require('stores/database'),
	jql = require('jql')

Array.prototype.minus = function (arr) {
    return this.map(function(n,i) {
        if(arr[i] || arr[i] === 0) return n - arr[i]
    })
}
Array.prototype.add = function (arr) {
    return this.map(function(n,i) {
        if(arr[i] || arr[i] === 0) return n + arr[i]
    })
}
Array.prototype.subtract = function (arr) {
    return this.map(function(n,i) {
        if(arr[i] || arr[i] === 0) return n - arr[i]
    })
}
Array.prototype.times = function (arr) {
    return this.map(function(n,i) {
        if(arr[i] || arr[i] === 0) return n * arr[i]
    })
}

/*
	NodeWorkflow
	--------------------------------
	Top level work flow object.
*/
var World = function(options) {



	/*
		Refs - vars - wtf evr
		---------------------------------------
	*/
	var _this = this;

	this.canvas
	this.overlay
	this.ctx
	this.overlayCtx

	this.size = options.container.getBoundingClientRect()
	this.container = options.container
	this.swatches = options.swatches || []
	this.layers = options.layers || []
	this.tiles = options.tiles || []


	this.STORE = new jql({
		swatches: {
			columns: ["id", "image"]
		},
		tiles: {
			columns: ['id']
		}
	})

	// window.CAT = this.STORE

	/*
		Grid
		-------------------
		Set grid size.
		Alters the snapping behavior as well as the grid visualization.
	*/
	var size = _.get(options, 'grid.size') || [32, 32],
		dimensions = _.get(options, 'grid.dimensions') || [32, 32],
		bounds = [[0,0],size]

	this.grid = {
		size: size,
		dimensions:dimensions,
		bounds: bounds
	}

	this.gridIsInsideBounds = function(grid) {
		return (
			grid[0] >= bounds[0][0]
			&& grid[0] <= bounds[1][0]
			&& grid[1] >= bounds[0][1]
			&& grid[1] <= bounds[1][1]
		)
	}

	this.gridToIndex = function(grid){
		if(
			grid[0] < 0 ||
			grid[0] > _this.grid.dimensions[0] ||
			grid[1] < 0 ||
			grid[1] > _this.grid.dimensions[1]
		) {
			return false
		}
		return Math.floor(grid[1] * _this.grid.dimensions[0]) + grid[0]
	}

	this.indexToGrid = function(i){
		var y = Math.floor(_this.grid.dimensions[0] / i),
			x = i - y
		return [x,y]
	}



	/*
		Transform
		-------------------
		This is essentially the model view transformation matrix simplified.
		Your translate represents the viewparameter's position on an 'infinite' 2d plane
		The scale is exactly what you think it is
		The skew is exactly what you think it is
	*/
	this.transform = {
		scale: [1, 1],
		skew: [0, 0],
		translate: [0, 0]
	}



	/*
		Mouse
		-------------------
		Various mouse related values in here.
		The mouse's position, button state, and collisions are updated on draw.
		Event handlers are applied on init
	*/
	this.mouse = {
		location: [0, 0],
		down: null,
		target: null,
		intent: "navigate",
		cursor: {
			size: [8, 8],
			color: 'rgba(90,90,90,.35)',
			hoverColor: 'rgba(90,90,200,8)'
		}
	};

	this.mouseDrag = function(e) {

		if (_this.mouse.down === null) {return;};

		if (this.mouse.intent === 'navigate') {
			_this.transform.translate[0] += e.movementX
			_this.transform.translate[1] += e.movementY
		}
	}

	this.mouseMove = function(e) {
		_this.mouse.location = _this.screenSpaceToWorld([parseInt(e.clientX), parseInt(e.clientY)]).subtract([_this.size.left, _this.size.top])
		_this.mouse.grid = _this.worldToGrid(_this.mouse.location)
		_this.mouseDrag(e)
	}

	this.mouseDown = function(e) {
		_this.mouse.down = _this.screenSpaceToWorld([parseInt(e.clientX), parseInt(e.clientY)]).subtract([_this.size.left, _this.size.top])
	}

	this.mouseUp = function(e) {
		_this.mouse.down = null
		_this.mouse.intent = "navigate"
		_this.mouse.target = null
	}



	/*
		Screen Space
		------------------------------------------------------------------
	*/
	this.descaleVector = function(v){
		var scalar = [1,1].minus(_this.transform.scale),
			original = v,
			scaled = v.subtract(_this.transform.translate),
			delta = original.minus(scaled)
		return v.add(v.times(scalar))
	}

	this.screenSpaceToWorld = function(vector) {
        var worldVector = vector.subtract(_this.transform.translate)
		return worldVector;
	}

	this.worldToScreenSpace = function(vector) {
      return vector.add(_this.transform.translate)
	}

	this.worldToGrid = function(vector) {
		return [
            Math.floor((vector[0] / _this.grid.size[0])),
            Math.floor((vector[1] / _this.grid.size[1]))
        ]
	}

	this.gridToWorld = function(vector) {
		return [
			(vector[0]) * _this.grid.size[0],
			(vector[1]) * _this.grid.size[1]
		]
	}

	this.snap = function(vector) {
		return [
			Math.round(vector[0] / _this.grid.size[0]) * _this.grid.size[0],
			Math.round(vector[1] / _this.grid.size[1]) * _this.grid.size[1]
		]
	}









	/*
		Swatches
		------------------------------------------------------------------
	*/

	this.swatches.map(function (swatch) {
		var img = new Image()
		img.onload = function(){_this.STORE.insert({id: swatch.id, image: img}).into('swatches').exec(function() {})}
		img.src = swatch.imageData
	})



	/*
		DRAW!!!!
		------------------------------------------------------------------
		Diff each cell in the grid
		if the cell has changed draw it to the cached image
		Draw the cached image on every frame
	*/

	var TILE_CACHE = [],  // A copy of the tiles object. Used to diff a layer.
		RENDER_CACHE = [] // A copy of a rendered layer.

	this.initDrawingSurfaces = function(){

		// Ensure some necessary styles are in place
		options.container.style.cursor = "none";
		options.container.style.position = "relative";

		// Clear the contents of the container
		_this.container.innerHTML = ""


		_this.canvas = document.createElement('canvas')
		_this.overlay = document.createElement('canvas')
		_this.overlay.style.pointerEvents = 'none'
		_this.overlay.style.position = 'absolute'
		_this.overlay.style.top = '0px'
		_this.overlay.style.left = '0px'
		_this.overlay.style.zIndex = '600'
		_this.ctx = _this.canvas.getContext('2d')
		_this.overlayCtx = _this.overlay.getContext('2d')

		// Create a canvas
		_this.canvases = this.layers.map(function(layer, i){
			var canvas = document.createElement('canvas')
			canvas.height = _this.size.height
			canvas.width = _this.size.width
			canvas.style.position = 'absolute'
			canvas.style.top = canvas.style.left = '0px'
			canvas.style.zIndex = i + 2
			_this.container.appendChild(canvas)
			return canvas
		})

		_this.contexts = _this.canvases.map(function(canvas){
			return canvas.getContext('2d')
		})

	}

	function applySize(canvas){
		canvas.height = _this.size.height
		canvas.width = _this.size.width
	}

	this.updateRenderDimensions = function(){

		_this.size = options.container.getBoundingClientRect()

		applySize(_this.overlay)

		applySize(_this.canvas)

		_this.canvases.map(applySize)

	}

	function applyTransform(ctx){
		ctx.setTransform(1, 0, 0, 1, 0, 0)
		ctx.setTransform(_this.transform.scale[0], _this.transform.skew[0], _this.transform.skew[1], _this.transform.scale[1], _this.transform.translate[0], _this.transform.translate[1])
	}

	this.updateTransform = function() {
		applyTransform(_this.ctx)
		applyTransform(_this.overlayCtx)
		_this.contexts.map(applyTransform)
	}

	this.clear = function() {
		var start = _this.screenSpaceToWorld([0, 0]);
		var stop = _this.screenSpaceToWorld([_this.size.width, _this.size.height]);
		_this.ctx.clearRect(start[0], start[1], stop[0], stop[1]);
		_this.overlayCtx.clearRect(start[0], start[1], stop[0], stop[1]);
	}

	this.clearLayer = function(l) {
		var start = _this.screenSpaceToWorld([0, 0]);
		var stop = _this.screenSpaceToWorld([_this.size.width, _this.size.height]);
		_this.contexts[l].clearRect(start[0], start[1], stop[0], stop[1]);
	}

	this.drawGrid = function() {

		var start = this.snap(this.transform.translate),
			startX = -start[0],
			endX = -start[0] + this.size.width,
			startY = -start[1],
			endY = -start[1] + this.size.height

		this.ctx.save()
		this.ctx.fillStyle = "rgba(0,0,0,.25)"
		this.ctx.font = "8px Verdana";

		for (var x = startX; x < endX; x += this.grid.size[0]) {
			for (var y = startY; y < endY; y += this.grid.size[1]) {
				var grid = this.worldToGrid([x,y])
				this.ctx.fillStyle = "rgba(0,0,0,.5)"
				this.ctx.fillRect(x - 1, y - 1, 2, 2)
				this.ctx.fillStyle = "rgba(0,0,0,1)"
				this.ctx.fillText(grid[0]+' - '+grid[1],x + (this.grid.size[0] * .25),y + (this.grid.size[1] * .25))

			}
		}

		this.ctx.restore()
	}

	this.drawTile = function(v, l) {
		// console.log(l)
		var layer = _this.layers[l],
			ctx = _this.contexts[l],
			index = _this.gridToIndex(v),
			tile = _.get(_this.tiles, '['+l+']['+index+']'),
			world = _this.gridToWorld(v),
			swatch = _.get(tile, 'swatch')

		if(swatch) {
			return _this.STORE.select('swatches').where({id:swatch}).exec(function (res) {
				var image = _.find(res.data, {id:swatch}) // TODO This shouldn't need to be filtered for some reason the query is selecting all swatches. the where clause appears to be failing.
				if (res.data[0]) ctx.drawImage(image.image,world[0],world[1])
			})
		} else {
			// ctx.fillRect( world[0], world[1], 5, 5)
		}

	}

	this.markZeroWorldSpace = function(){
		var drawVector = [0,0]
		_this.ctx.save()
		_this.ctx.fillStyle = "rgba(255,0,0,.5)"
		_this.ctx.fillRect(drawVector[0] - 2.5, drawVector[1] - 2.5, 5, 5)
		_this.ctx.restore()
	}

	this.outlineViewport = function(){

		var startVector = 	_this.screenSpaceToWorld([5,5]),
			heightWidth = 	[_this.size.width - 10, _this.size.height - 10],
			endVector = 	startVector.add(heightWidth)

		_this.ctx.save()
		_this.ctx.moveTo(startVector[0], startVector[1])
		_this.ctx.lineTo(endVector[0], startVector[1])
		_this.ctx.lineTo(endVector[0], endVector[1])
		_this.ctx.lineTo(startVector[0], endVector[1])
		_this.ctx.lineTo(startVector[0], startVector[1])
		_this.ctx.stroke()
		_this.ctx.restore()

	}

	this.drawCursor = function() {
		_this.overlayCtx.fillRect(
			this.mouse.location[0] - (_this.mouse.cursor.size[0] * .5),
			this.mouse.location[1] - (_this.mouse.cursor.size[1] * .5),
			this.mouse.cursor.size[0],
			this.mouse.cursor.size[1]
		)
	}



	this.drawLayers = function(){
		for(var l = 0; l < _this.layers.length; l++){

			var diff = _.difference(TILE_CACHE[l], _this.tiles[l])

			TILE_CACHE[l] = _.clone(_this.tiles[l]) // cache it so we can diff it next time

			if(diff.length){
				this.clearLayer(l)
				for(var y = 0; y < _this.grid.dimensions[0]; y++) {
					for(var x = 0; x < _this.grid.dimensions[1]; x++) {
						_this.drawTile([x,y], l)
					}
				}
			}

		}
	}

	this.draw = function() {

		_this.updateRenderDimensions()
		_this.updateTransform()
		// _this.clear()
		// _this.drawGrid()
		_this.drawLayers()

		// _this.markZeroWorldSpace()
		_this.drawCursor()

		window.setTimeout(function(){window.requestAnimationFrame(_this.draw);}, 1000 / 30)

	}
































	// events
	// ------------------------------------------------------------------
	this.initDrawingSurfaces();

    options.container.onresize = function(){
      _this.updateRenderDimensions()
    }

    window.onresize = function(){
      _this.updateRenderDimensions()
    }

	options.container.onmousemove = function(e) {
		_this.mouseMove(e);
	};
	options.container.onmousedown = function(e) {
		_this.mouseDown(e);
	};
	options.container.onmouseup = function(e) {
		_this.mouseUp(e);
	};
	options.container.ondblclick = function(e) {
		_this.mouseDblClick(e);
	};

	var handleScroll = function(evt){
		return false
	  if (!evt) evt = event;
	  var direction = (evt.detail<0 || evt.wheelDelta>0) ? 1 : -1;
	  // Use the value as you will
	  _this.transform.scale[0] += direction * .003
	  _this.transform.scale[1] += direction * .003
	  if(_this.transform.scale[0] > 1){_this.transform.scale[0] = 1}
	  if(_this.transform.scale[0] < .5){_this.transform.scale[0] = .5}
	  if(_this.transform.scale[1] > 1){_this.transform.scale[1] = 1}
	  if(_this.transform.scale[1] < .5){_this.transform.scale[1] = .5}
	};

	this.canvas.addEventListener('DOMMouseScroll',handleScroll,false); // for Firefox
	this.canvas.addEventListener('mousewheel',    handleScroll,false); // for everyone else

	// INIT
	// ------------------------------------------------------------------
	options.container.appendChild(this.canvas);
	options.container.appendChild(this.overlay);

	_this.updateRenderDimensions()

	this.draw()
}
 module.exports = World
