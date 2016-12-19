var React = require('react'),
	translate = require('translate'),
	CardCarousel = require('components/CardCarousel')

/**
 *	@class Vote
 */
class Vote extends React.Component {

/**
 *	@method render
 *	@memberof Vote
 */
 /*
 <div className='spheres'>
	 <div className="marry"></div>
	 <div className="fuck"></div>
	 <div className="kill"></div>
 </div>
 */
	render() {
		return (
			<div className='Vote'>
				<CardCarousel></CardCarousel>
			</div>
		)
	}
}
module.exports = Vote
