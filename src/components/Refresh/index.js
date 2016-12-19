var React = require('react')

class Refresh extends React.Component {

	refresh () {
		window.location.reload()
	}

	render() {
		return <div className='Refresh' onClick={this.refresh}>x</div>
	}

}

module.exports = Refresh
