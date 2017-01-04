var React = require('react'),
	translate = require('translate'),
	classname = require('classname'),
	Button = require('components/Button'),
	Input = require('components/Input')

/**
 *	@class Login
 */
class Login extends React.Component {

	onChange () {

	}

	attemptLogin () {

		this.props.store.dispatch({
			type: 'LOGIN',
			sumonerName: this.refs.sumonerName.value,
			email: this.refs.email.value,
			password: this.refs.password.value
		})

		this.props.store.dispatch({
			type: 'NAVIGATE',
			view: 'home'
		})

	}

/**
 *	@method render
 *	@memberof Login
 */
	render() {
		var className = {
				Login:	true
			}
		return (
			<div className={classname(className)}>

				<div className="row">
					<div className="col-1-1">
						<Input
							ref="sumonerName"
							value='Diarrhea Bubbles'
							type='text'
							onChange={this.onChange}
						/>
					</div>
					<div className="col-1-1">
						<Input
							ref="email"
							value='shawnsdrive@gmail.com'
							type='email'
							onChange={this.onChange}
						/>
					</div>
					<div className="col-1-1">
						<Input
							ref="password"
							value='password'
							type='password'
							onChange={this.onChange}
						/>
					</div>
					<div className="col-1-1">
						<Button onClick={this.attemptLogin.bind(this)}>Login</Button>
					</div>
				</div>
			</div>
		)
	}
}
module.exports = Login
