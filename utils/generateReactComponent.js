module.exports = function(where, componentName){
	var APP_ROOT = __dirname+'/..',
		COMPONENT_ROOT = APP_ROOT+'/src/'+where,
		fs = require('fs'),
		componentDir = COMPONENT_ROOT+'/'+componentName,
		componentStylesDir = componentDir+'/styles'

	fs.mkdir(componentDir, function () {
		fs.mkdir(componentStylesDir, function () {
			fs.writeFile(componentStylesDir+'/style.less', '.'+componentName+'{}', function(err) {});

			fs.writeFile(componentDir+'/index.js',
				[
				"var React = require('react'),",
				"	translate = require('translate'),",
				"	classname = require('classname')",
				"",
				"/**",
				" *	@class "+componentName,
				" */",
				"class "+componentName+" extends React.Component {",
				"",
				"/**",
				" *	@method render",
				" *	@memberof "+componentName,
				" */",
				"	render() {",
				"		var className = {",
				"			"+componentName+":	true",
				"		}",
				"		return (",
				"			<div className={classname(classname)}>"+componentName+"</div>",
				"		)",
				"	}",
				"}",
				"module.exports = "+componentName+""
			].join('\n')
				, function(err) {});
		})
	})

}
