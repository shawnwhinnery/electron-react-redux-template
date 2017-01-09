
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

	this.canvas = document.createElement('canvas')
	this.ctx = this.canvas.getContext('2d')
	this.overlay = document.createElement('canvas')
	this.overlay.style.pointerEvents = 'none'
	this.overlay.style.position = 'absolute'
	this.overlay.style.top = '0px'
	this.overlay.style.left = '0px'
	this.overlay.style.zIndex = '600'
	this.overlayCtx = this.overlay.getContext('2d')
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

	window.CAT = this.STORE

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

		if (_this.mouse.down === null) {
			return;
		};

		if (_this.mouse.target && this.mouse.intent === 'drag') {
			_this.mouse.target.location[0] += e.movementX
			_this.mouse.target.location[1] += e.movementY


			return;
		}

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
		// document.body.appendChild(img)
	})




	/*
		Layers
		------------------------------------------------------------------
	*/

	this.canvases = this.layers.map(function(layer){
		var canvas = document.createElement('canvas')
		canvas.height = _this.size.height
		canvas.width = _this.size.width
		return canvas
	})

	this.contexts = this.canvases.map(function(canvas){
		return canvas.getContext('2d')
	})










	/*
		DRAW!!!!
		------------------------------------------------------------------
	*/
    this.updateRenderDimensions = function(){
      _this.size = options.container.getBoundingClientRect()
      _this.canvas.height = this.size.height;
      _this.canvas.width = this.size.width;
      _this.overlay.height = this.size.height;
      _this.overlay.width = this.size.width;
    }

	this.updateTransform = function() {
		_this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		_this.overlayCtx.setTransform(1, 0, 0, 1, 0, 0);
		_this.ctx.setTransform(_this.transform.scale[0], _this.transform.skew[0], _this.transform.skew[1], _this.transform.scale[1], _this.transform.translate[0], _this.transform.translate[1]);
		_this.overlayCtx.setTransform(_this.transform.scale[0], _this.transform.skew[0], _this.transform.skew[1], _this.transform.scale[1], _this.transform.translate[0], _this.transform.translate[1]);
	}

	this.clear = function() {
		var start = _this.screenSpaceToWorld([0, 0]);
		var stop = _this.screenSpaceToWorld([_this.size.width, _this.size.height]);
		_this.ctx.clearRect(start[0], start[1], stop[0], stop[1]);
		_this.overlayCtx.clearRect(start[0], start[1], stop[0], stop[1]);
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
			ctx = _this.ctx,
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
			for(var y = 0; y < _this.grid.dimensions[0]; y++) {
				for(var x = 0; x < _this.grid.dimensions[1]; x++) {
					_this.drawTile([x,y], l)
				}
			}
		}
	}

	this.draw = function() {

		_this.updateRenderDimensions()
		_this.updateTransform()
		_this.clear()
		// _this.drawGrid()
		_this.drawLayers()

		// _this.markZeroWorldSpace()
		_this.drawCursor()

		window.setTimeout(function(){window.requestAnimationFrame(_this.draw);}, 1000 / 30)

	}
































	// events
	// ------------------------------------------------------------------
	options.container.style.cursor = "none";

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


	options.container.appendChild(this.canvas);
	options.container.appendChild(this.overlay);

	_this.updateRenderDimensions()

	this.draw()
}
 module.exports = World
