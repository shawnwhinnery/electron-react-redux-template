
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


	var LAYER_CACHE = [],  // A copy of the tiles object. Used to diff a layer.
		RENDER_CACHE = [], // A copy of a rendered layer.
		STORE = new jql({
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
	var size = _.get(options, 'grid.size') || [32, 32],				// px of each grid
		dimensions = _.get(options, 'grid.dimensions') || [32, 32], // # of grid squares
		bounds = [[0,0],size]										// [0,0] -> [gridx,gridy]

	this.grid = {
		size: size,
		dimensions: dimensions,
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
		Tiles
		------------------------------------------------------------------
	*/

	this.setTiles = function(tiles){
		_this.tiles = tiles
		_this.processTiles()
	}

	this.processTiles = function(){
		var totalTileCount = _this.grid.dimensions[0] * _this.grid.dimensions[1]
		for(var l = 0; l < _this.tiles.length; l++) {
			for(var t = 0; t < totalTileCount; t++) {
				_this.tiles[l][t] = (_this.tiles[l][t]) ? _this.tiles[l][t] : {swatch: 1}
			}
		}
	}




	/*
		Swatches
		------------------------------------------------------------------
	*/

	this.swatches.map(function (swatch) {
		var img = new Image()
		img.onload = function(){STORE.insert({id: swatch.id, image: img}).into('swatches').exec(function() {})}
		img.src = swatch.imageData
	})

	this.getSwatch = function(id){
		var res = STORE.select('swatches').where({id:id}).exec()
		res = _.find(res.data, {id:id})
		// console.log('<-', res)
		return res
	}



	/*
		Render
		-------------------------
	*/

	this.renderTile = function(i, l){

		var index = 		i,
			grid = 			_this.indexToGrid(i),
			world = 		_this.gridToWorld(grid),
			tileKey =		"["+l+"]["+index+"]",
			// defaultTile = 	{swatch: _this.layers[l].defaultSwatch},
			tile = 			_.get(_this.tiles, tileKey),
			cachedTile = 	_.get(LAYER_CACHE, tileKey),
			swatch = 		_this.getSwatch(tile.swatch),
			image =			_.get(swatch, 'image'),
			diff = 			_.difference(tile, cachedTile),
			ctx = 			_this.offScreenCtx,
			surfaceArea = 	_this.grid.dimensions.times(_this.grid.size)

		if(!image) return

		if( diff.length || !cachedTile ) {

			if(!LAYER_CACHE[l]) LAYER_CACHE[l] = []

			LAYER_CACHE[l][index] = tile

			if(RENDER_CACHE[l]) ctx.putImageData(RENDER_CACHE[l], 0, 0) // img data, start x, start y

			if(image) ctx.drawImage(image, world[0], world[1])
			// if(image) ctx.drawImage(image, 0, 0)
			else console.log('swatch not found')

			RENDER_CACHE[l] = ctx.getImageData(0,0,surfaceArea[0], surfaceArea[1])

		}
		//else {
			// console.log(0)
		// }

	}

	this.renderLayer = function(l){
		if(!_this.tiles[l]) return console.log(0)
		for(var t = 0; t < _this.tiles[l].length; t++) _this.renderTile(t,l)
	}

	this.renderLayers = function(){
		for(var l = 0; l < _this.layers.length; l++) _this.renderLayer(l)
	}

	/*
		DRAW!!!!
		------------------------------------------------------------------
		Diff each cell in the grid
		if the cell has changed draw it to the cached image
		Draw the cached image on every frame
	*/

	function applySize(canvas){
		canvas.height = _this.size.height
		canvas.width = _this.size.width
	}

	function applyTransform(ctx){
		ctx.setTransform(1, 0, 0, 1, 0, 0)
		ctx.setTransform(_this.transform.scale[0], _this.transform.skew[0], _this.transform.skew[1], _this.transform.scale[1], _this.transform.translate[0], _this.transform.translate[1])
	}

	this.initDrawingSurfaces = function(){

		// Ensure some necessary styles are in place
		options.container.style.cursor = "none";
		options.container.style.position = "relative";

		// Clear the contents of the container
		_this.container.innerHTML = ""

		_this.canvas = document.createElement('canvas')
		_this.offScreenCanvas = document.createElement('canvas')

		var worldSize = _this.grid.size.times(_this.grid.dimensions)
		_this.offScreenCanvas.height = worldSize[1]
		_this.offScreenCanvas.width = worldSize[0]
		_this.offScreenCanvas.style.display = 'none'

		_this.overlay = document.createElement('canvas')
		_this.overlay.style.pointerEvents = 'none'
		_this.overlay.style.position = 'absolute'
		_this.overlay.style.top = '0px'
		_this.overlay.style.left = '0px'
		_this.overlay.style.zIndex = '600'

		_this.ctx = _this.canvas.getContext('2d')
		_this.overlayCtx = _this.overlay.getContext('2d')
		_this.offScreenCtx = _this.offScreenCanvas.getContext('2d')

	}

	this.updateRenderDimensions = function(){

		_this.size = options.container.getBoundingClientRect()

		applySize(_this.overlay)

		applySize(_this.canvas)

		// applySize(_this.offScreenCanvas)

	}

	this.updateTransform = function() {
		applyTransform(_this.ctx)
		applyTransform(_this.overlayCtx)
		// applyTransform(_this.offScreenCtx)
		// _this.contexts.map(applyTransform)
	}

	this.clear = function() {
		return
		var start = _this.screenSpaceToWorld([0, 0]);
		var stop = _this.screenSpaceToWorld([_this.size.width, _this.size.height]);
		_this.ctx.clearRect(start[0], start[1], stop[0], stop[1]);
		_this.overlayCtx.clearRect(start[0], start[1], stop[0], stop[1]);
	}

	this.drawGrid = function() {
		for(var y = 0; y < _this.grid.dimensions[1]; y++) {
			for(var x = 0; x < _this.grid.dimensions[0]; x++) {
				var location = [x, y].times(_this.grid.size)
				_this.overlayCtx.strokeRect(location[0], location[1], _this.grid.size[0], _this.grid.size[1])
			}
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

	this.clearLayer = function(l) {
		return
		var start = _this.screenSpaceToWorld([0, 0]);
		var stop = _this.screenSpaceToWorld([_this.size.width, _this.size.height]);
		_this.contexts[l].clearRect(start[0], start[1], stop[0], stop[1]);
	}

	this.drawLayers = function(){
		for(var l = 0; l < _this.layers.length; l++) {
			if(RENDER_CACHE[l]) {
				// _this.ctx.putImageData( RENDER_CACHE[l], 0, 0) // The problem here is that putImageData is not affected by the transformation matrix.
				_this.ctx.putImageData( RENDER_CACHE[l], _this.transform.translate[0], _this.transform.translate[1])
			} else {
				console.log(RENDER_CACHE[l])
			}
		}
	}

	this.getCache = function() {
		return [RENDER_CACHE, LAYER_CACHE]
	}

	this.draw = function() {
		_this.updateRenderDimensions()
		_this.updateTransform()
		_this.renderLayers()
		_this.drawGrid()
		_this.drawLayers()
		_this.drawCursor()
		window.setTimeout(function(){window.requestAnimationFrame(_this.draw);}, 1000 / 60)
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
	this.canvas.id = 'canvas'
	this.offScreenCanvas.id = 'offScreenCanvas'
	this.overlay.id = 'overlayCanvas'
	options.container.appendChild(_this.offScreenCanvas);
	options.container.appendChild(this.canvas);
	options.container.appendChild(this.overlay);

	_this.updateRenderDimensions()

	this.draw()
}
 module.exports = World
