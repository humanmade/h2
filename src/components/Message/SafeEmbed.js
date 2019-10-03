import React from 'react';

/**
 * Render an embed previously marked as safe.
 *
 * These are rendered on the backend, so we don't need to worry about them here.
 */
export default class SafeEmbed extends React.Component {
	constructor( props ) {
		super( props );

		this.removeResizeEvent = () => {};
	}

	componentDidMount() {
		this.container.appendChild( this.props.node );
		this.attachResizeEvent();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.node !== this.props.node ) {
			this.container.removeChild( prevProps.node );
			this.removeResizeEvent();
			this.container.appendChild( this.props.node );
			this.attachResizeEvent();
		}
	}

	componentWillUnmount() {
		this.container.removeChild( this.props.node );
		this.removeResizeEvent();
	}

	attachResizeEvent() {
		let doc;
		const { node } = this.props;

		const handleResize = () => {
			try {
				doc = node.contentDocument || node.contentWindow.document;
			} catch ( err ) {
				return;
			}

			const height = doc.documentElement.offsetHeight;
			if ( height < 100 ) {
				// Likely about:blank, skip until the document has loaded.
				return;
			}

			node.style.height = height + 'px';
		};

		// Check that the node isn't cross-origin first.
		try {
			// eslint-disable-next-line no-unused-vars
			const doc = node.contentDocument || node.contentWindow.document;
		} catch ( err ) {
			return;
		}

		node.addEventListener( 'load', handleResize );
		node.contentWindow.addEventListener( 'resize', handleResize );
		this.removeResizeEvent = () => {
			node.removeEventListener( 'load', handleResize );
			node.contentWindow.removeEventListener( 'resize', handleResize );
		};
	}

	render() {
		return <div className="SafeEmbed" ref={ ref => this.container = ref } />;
	}
}
