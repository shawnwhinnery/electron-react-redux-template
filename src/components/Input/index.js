var React = require('react'),
	_ = require('lodash'),
	classname = require('classname')

class Input extends React.Component {

	render() {
		var props = _.omit(this.props, ['placeholder', 'label', 'exit', 'bounce']),
			labelText = this.props.label || this.props.placeholder,
			label = (labelText) ? <label>{labelText}</label> : null,
			className = {
				'Input animated': true,
				"valueSet": (this.props.value !== ""),
				'bounce': !!this.props.bounce,
				'bounceOutDown': !!this.props.exit,
				'bounceInUp': (!this.props.exit),
			}

		return (
			<div className={classname(className)}>
				<input {...props} />
				{label}
				<div className='focus'></div>
			</div>
		)
	}

}

module.exports = Input
