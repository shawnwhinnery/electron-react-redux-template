var Jql = require('jql')

var database  = new Jql({
	users: {
		columns: ["id","name", "email", "password"]
	},
	swatches: {
		columns: ["id","name", "height", "width"]
	},
	projects: {
		columns: [
			"id",
			"user",
			"name",
			"defaultSwatch",
			"grid",
			"tiles",
			"layers"
		]
	}
})


database.insert({
	id: 1,
	email: 'shawnsdrive@gmail.com',
	password: 'password'
}).into('users').exec(function () {
	console.log('bootstrapped users')
})


database.insert([
	{
		id: 1,
		name: "x",
		imageData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAsVBMVEUAAAAAAAAyAAAvAABrAAAEAACwAADhHx8AAACpAACzAAAhAAAzAACMAAAbAACIAADlICB3BQWrAACRAACvAAAzAAASAAAcAACXAACLAACgAACfAAAgAAAcAAA7AAAAAAAVAABCAAC8AADpMzPbCAiuAACQAADPBgbiLS17AADVDg7aMTHKCAgYAAARAAAoAABzBQVhAADvAADxAwPsAADpAADeAADiAADtAADgAADrAAD/mihVAAAAMnRSTlMABlAwJgzb2gnq3GAy61Tl4zHs7O9TPRjr5uXZWlhXMCQc7ejn5OTj4d3X09BTSjgzLwwYW3gAAAD5SURBVDjLfdLZUsJAEEDR0RhExA2FIIqI+8oyJBD4/w9jmk7VnYaq9FvPuU+duGrSzJkZj+1+8ttqx/vNVysxfrrIQ4FfL/JGYtz7UOCyN9rGtcClSGLXAtcCp1CnSP9kp5gFZ394dtmg8Ez5+Rq5X1/03NFxpyoY/Dx1NcVy51KcURh/FKc49KY6hfH7YeUU1i93TvFifNNXZ+ZvJijfp5i9N1eudQq8psAPCrymsJ6X+0X2E/uyf1d4+z8k4QW/Gnbjm67kf3jSQv2/ydWD38r31kJd7qsFHl66nQLXAqdQp1CnUKdQ5+XjW5x9oP8jL6OROHtvUvkWi5puNBHTYM0AAAAASUVORK5CYII=",
		height: 32,
		width: 32
	},
	{
		id: 2,
		name: "check",
		imageData: "data:image/png;base64,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",
		height: 32,
		width: 32
	}
]).into('swatches').exec(function(){

})

database.insert([
	{
		id:1,
		user: 1,
		name: 'Test 1',
		defaultSwatch: 1,
		grid: {
			size: [32,32],
			dimensions: [8,8]
		},
		tiles: [
			{
				layer: 0,
				swatch: 1,
				location: 0
			},
			{
				layer: 0,
				swatch: 2,
				location: 1
			}
		],
		layers: [
			{name: 'layer 1'},
			{name: 'layer 3'},
			{name: 'layer 4'},
			{name: 'layer 5'}
		]
	}
]).into('projects').exec(function(){
	console.log('bootstrapped projects')
})

module.exports = database
