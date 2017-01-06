var React = require('react'),
	translate = require('translate'),
	classname = require('classname'),
	Button = require('components/Button'),
	Input = require('components/Input')

/**
 *	@class Login
 */
class Login extends React.Component {

	constructor(props) {

	  super(props)

	  this.state = {
		  email: "shawnsdrive@gmail.com",
		  password: "password"
	  }

	}

	onChangeEmail (e) {
		this.setState({email: e.target.value})
	}

	onChangePassword (e) {
		this.setState({password: e.target.value})
	}

	attemptLogin () {

		this.props.store.dispatch({
			type: 'LOGIN',
			email: this.state.email,
			password: this.state.password
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
							ref="email"
							value={this.state.email}
							type='email'
							onChange={this.onChangeEmail.bind(this)}
						/>
					</div>
					<div className="col-1-1">
						<Input
							ref="password"
							value={this.state.password}
							type='password'
							onChange={this.onChangePassword.bind(this)}
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
