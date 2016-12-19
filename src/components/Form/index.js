var React = require('react'),
	translate = require('translate'),
	Input = require('components/Input')

/**
 *	@class Form
 */
class Form extends React.Component {

	renderInput (inputObj, i) {
		var store = this.props.store,
			form = this

		function writeback(e) {
			store.dispatch({
				type: 'SET_FORM_VALUE',
				name: inputObj.name,
				value: e.target.value
			})
			form.forceUpdate()
		}

		inputObj.key = 'input-'+i
		inputObj.onChange = writeback
		inputObj.onInput = writeback
		inputObj.exit = !!this.props.exit

		return <Input {...inputObj}/>

	}

/**
 *	@method render
 *	@memberof Form
 */
	render() {
		var state = this.props.store.getState()
		return (
			<div className='Form'>
				{state.form.map(this.renderInput.bind(this))}
				{this.props.children}
			</div>
		)
	}
}
module.exports = Form
