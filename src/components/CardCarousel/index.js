var React = require('react'),
	translate = require('translate'),
	Card = require('components/Card')

/**
 *	@class CardCarousel
 */
class CardCarousel extends React.Component {

/**
 *	@method render
 *	@memberof CardCarousel
 */
	render() {
		return (
			<div className='CardCarousel'>
				<Card />
				<Card />
				<Card />
			</div>
		)
	}
}
module.exports = CardCarousel
