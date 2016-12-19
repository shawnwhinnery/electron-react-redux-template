var React = require('react'),
	translate = require('translate'),
	Button = require('components/Button'),
	Form = require('components/Form'),
	Circle = require('components/Circle')

/**
 *	@class Home
 */
class Home extends React.Component {

	playSolo () {
		this.props.store.dispatch({type: 'NAVIGATE_LOBBY'})
	}

/**
 *	@method render
 *	@memberof Home
 */
	render() {

		var formProps = {
			store: this.props.store
		}

		return (
			<div className='Home'>
				<Circle/>
				<Form {...formProps}>
					<Button>Play</Button>
					<Button onClick={this.playSolo.bind(this)}>Play With Friends</Button>
				</Form>
			</div>
		)
	}
}
module.exports = Home
