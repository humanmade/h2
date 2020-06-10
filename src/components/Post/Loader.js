import React from 'react';
import ContentLoader from 'react-content-loader';

import './Loader.css';

export default class Loader extends React.Component {
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
		const replyButtonWidth = 88;
		const contentOffset = 89;
		const textLineHeight = 28;

		const { width } = this.props;
		if ( this.state.isMobile ) {
			return (
				<ContentLoader
					className="Post-Loader"
					height={ contentOffset + 5 * textLineHeight }
					width={ width }
					style={ { width } }
				>
					{ /* Avatar */ }
					<circle cx={ width - 12 } cy="12" r="12" />

					{ /* Title */ }
					<rect x="0" y="0" rx="4" ry="4" width="315" height="23.5" />
					<rect x="0" y="40" rx="3" ry="3" width="160" height="10.5" />

					{ /* Text */ }
					<rect x="0" y={ contentOffset } rx="3" ry="3" width="625" height="13" />
					<rect x="0" y={ contentOffset + textLineHeight } rx="3" ry="3" width="613" height="13" />
					<rect x="0" y={ contentOffset + 2 * textLineHeight } rx="3" ry="3" width="580" height="13" />
					<rect x="0" y={ contentOffset + 3 * textLineHeight } rx="3" ry="3" width="610" height="13" />
				</ContentLoader>
			);
		}

		return (
			<ContentLoader
				className="Post-Loader"
				height={ contentOffset + 5 * textLineHeight }
				width={ width }
				style={ { width } }
			>
				{ /* Avatar */ }
				<circle x="0" cx="30" cy="30" r="30" />

				{ /* Title */ }
				<rect x="90" y="6" rx="4" ry="4" width="315" height="23.5" />
				<rect x="90" y="46" rx="3" ry="3" width="160" height="10.5" />

				{ /* Buttons */ }
				<rect
					x={ width - replyButtonWidth }
					y="12"
					rx="3"
					ry="3"
					width={ replyButtonWidth }
					height="30"
				/>

				{ /* Text */ }
				<rect x="90" y={ contentOffset } rx="3" ry="3" width="625" height="13" />
				<rect x="90" y={ contentOffset + textLineHeight } rx="3" ry="3" width="613" height="13" />
				<rect x="90" y={ contentOffset + 2 * textLineHeight } rx="3" ry="3" width="580" height="13" />
				<rect x="90" y={ contentOffset + 3 * textLineHeight } rx="3" ry="3" width="610" height="13" />
			</ContentLoader>
		);
	}
}
