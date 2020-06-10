import React from 'react';
import ContentLoader from 'react-content-loader';

import './Loader.css';

export default class CommentLoader extends React.Component {
	static defaultProps = {
		width: 740,
	}

	constructor( props ) {
		super( props );
		this.mediaQuery = window.matchMedia( '(max-width: 600px)' );
		this.state = {
			isMobile: this.mediaQuery.matches,
		};
		this.mediaQuery.addListener( this.onQueryChange );
	}

	onQueryChange = e => {
		this.setState( { isMobile: e.matches } );
	}

	render() {
		let contentOffset = 56;
		const textLineHeight = 28;

		const { width } = this.props;
		if ( this.state.isMobile ) {
			contentOffset = 42;
			return (
				<ContentLoader
					className="Comment-Loader Comment-Loader--mobile"
					height={ contentOffset + 5 * textLineHeight }
					width={ width }
					style={ { width } }
				>
					{ /* Avatar */ }
					<circle cx="21" cy="12" r="12" />

					{ /* Timeline */ }
					<rect x="20" width="3" height={ contentOffset + 5 * textLineHeight } />

					{ /* Title */ }
					<rect x="40" y="4" rx="4" ry="4" width="240" height="16" />

					{ /* Text */ }
					<rect x="40" y={ contentOffset } rx="3" ry="3" width="325" height="13" />
					<rect x="40" y={ contentOffset + textLineHeight } rx="3" ry="3" width="313" height="13" />
					<rect x="40" y={ contentOffset + 2 * textLineHeight } rx="3" ry="3" width="280" height="13" />
					<rect x="40" y={ contentOffset + 3 * textLineHeight } rx="3" ry="3" width="310" height="13" />
				</ContentLoader>
			);
		}

		return (
			<ContentLoader
				className="Comment-Loader"
				height={ contentOffset + 5 * textLineHeight }
				width={ width }
				style={ { width } }
			>
				{ /* Avatar */ }
				<circle x="130" cx="110" cy="20" r="20" />

				{ /* Timeline */ }
				<rect x="109" width="3" height={ contentOffset + 5 * textLineHeight } />

				{ /* Title */ }
				{ /* 150+ */ }
				<rect x="150" y="7" rx="4" ry="4" width="315" height="23.5" />
				{ /* <rect x="170" y="46" rx="3" ry="3" width="160" height="10.5" /> */ }

				{ /* Text */ }
				<rect x="150" y={ contentOffset } rx="3" ry="3" width="525" height="13" />
				<rect x="150" y={ contentOffset + textLineHeight } rx="3" ry="3" width="513" height="13" />
				<rect x="150" y={ contentOffset + 2 * textLineHeight } rx="3" ry="3" width="480" height="13" />
				<rect x="150" y={ contentOffset + 3 * textLineHeight } rx="3" ry="3" width="510" height="13" />
			</ContentLoader>
		);
	}
}
