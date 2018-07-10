import PropTypes from 'prop-types';
import React from 'react';

import './DropUpload.css';

const INITIAL_STATE = { dropping: false };

export default class DropUpload extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = { ...INITIAL_STATE };
	}

	onDragOver( e ) {
		e.preventDefault();

		// Explicitly show this is a copy.
		e.dataTransfer.dropEffect = 'copy';

		this.setState( { dropping: true } );
	}

	onDragLeave( e ) {
		e.preventDefault();

		this.setState( { dropping: false } );
	}

	onDrop( e ) {
		e.preventDefault();

		// If there's no files, ignore it.
		if ( ! e.dataTransfer.files.length ) {
			this.setState( { dropping: false } );
			return;
		}

		this.setState( { dropping: false } );
		this.props.onUpload( Array.from( e.dataTransfer.files ) );
	}

	onInputChange( e ) {
		this.props.onUpload( Array.from( e.target.files ) );
	}

	render() {
		const { allowMultiple, children, files } = this.props;

		return (
			<div
				className={ `DropUpload ${ this.state.dropping ? 'dropping' : ''}` }
				onDragOver={ e => this.onDragOver( e ) }
				onDragLeave={ e => this.onDragLeave( e ) }
				onDrop={ e => this.onDrop( e ) }
			>
				{ children }

				<div className="DropUpload-status">
					{ files.length ? (
						files.map( file => (
							<p key={ `${ file.name }-${ file.lastModified }` }>
								<span className="Loading loading--active"></span>

								Uploading { file.name }…
							</p>
						) )
					) : (
						<p className="buttons">
							<label className="DropUpload-uploader">
								<input
									multiple={ allowMultiple }
									type="file"
									onChange={ e => this.onInputChange( e ) }
								/>
								<a>Upload an attachment</a>
							</label>
							<span> or drop files here.</span>
						</p>
					) }
				</div>
			</div>
		);
	}
}

DropUpload.defaultProps = { allowMultiple: false };

DropUpload.propTypes = {
	allowMultiple: PropTypes.bool,
	files: PropTypes.arrayOf( PropTypes.shape( { name: PropTypes.string.isRequired } ) ),
	onUpload: PropTypes.func.isRequired,
};
