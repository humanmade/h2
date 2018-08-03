import React from 'react';

/**
 * Render an embed previously marked as safe.
 *
 * These are rendered on the backend, so we don't need to worry about them here.
 */
export default class SafeEmbed extends React.Component {
	componentDidMount() {
		this.container.appendChild( this.props.node );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.node !== this.props.node ) {
			this.container.removeChild( prevProps.node );
			this.container.appendChild( this.props.node );
		}
	}

	componentWillUnmount() {
		this.container.removeChild( this.props.node );
	}

	render() {
		return <div className="SafeEmbed" ref={ ref => this.container = ref } />;
	}
}
