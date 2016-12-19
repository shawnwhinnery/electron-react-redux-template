var React = require('react'),
	translate = require('translate'),
	Form = require('components/Form'),
	Button = require('components/Button')

/**
 *	@class Login
 */
class Login extends React.Component {

	submitLogin () {
		var state = this.props.store.getState(),
			store = this.props.store,
			self = this

		self.props.dispatch({
			type: 'ATTEMPT_LOGIN',
			email: state.form[0].value,
			password: state.form[1].value
		})

		// DEV -------------------------------------------------------------
		// faux back end auth call
		// DEV -------------------------------------------------------------
		setTimeout(function(){

			self.props.dispatch({
				type: 'LOGIN_SUCCESSFUL',
				email: state.form[0].value,
				password: state.form[1].value
			})

			setTimeout(function () {
				self.props.dispatch({type: 'NAVIGATE_HOME'}) // props.dispatch will re-render at the top level
			}, 650)

		}, 3000)
		// DEV -------------------------------------------------------------

		this.forceUpdate()
	}

/**
 *	@method render
 *	@memberof Login
 */
	render() {
		var state = this.props.store.getState(),
			formProps = _.merge({}, this.props, {
				exit: !!state.auth.isAuthenticated
			}),
			buttonProps = {
				icon: (!!state.auth.isAuthenticating || !!state.auth.isAuthenticated),
				exit: !!state.auth.isAuthenticated,
				bounce: state.auth.isAuthenticating,
				onClick: (state.auth.isAuthenticating) ?  null : this.submitLogin.bind(this)
			}
			console.log(this.props.store.getState());
		return (
			<div className='Login'>
				<Form {...this.props}>
					<Button {...buttonProps}>{translate('login', 'Login')}</Button>
				</Form>
			</div>
		)
	}
}
module.exports = Login
