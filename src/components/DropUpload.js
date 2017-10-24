import PropTypes from 'prop-types';
import React from 'react';

import './DropUpload.css';

const INITIAL_STATE = {
	dropping: false,
	progress: 0,
	uploadMessage: '',
};

export default class DropUpload extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = { ...INITIAL_STATE };
	}

	onDragOver( e ) {
		e.preventDefault();

		// Explicitly show this is a copy.
		e.dataTransfer.dropEffect = 'copy';

		this.setState({ dropping: true });
	}

	onDragLeave( e ) {
		e.preventDefault();

		this.setState({ dropping: false });
	}

	onDrop( e ) {
		e.preventDefault();

		// If there's no files, ignore it.
		if ( ! e.dataTransfer.files.length ) {
			this.setState({ dropping: false });
			return;
		}

		const file = e.dataTransfer.files[0];
		this.setState({ dropping: false });
		this.props.onUpload( file );
	}

	onCancel() {
		this.setState( { ...INITIAL_STATE } );
		this.props.onCancel();
	}

	render() {
		const { children, file } = this.props;

		if ( ! file ) {
			return <div
				className={ `DropUpload ${ this.state.dropping ? 'dropping' : ''}` }
				onDragOver={ e => this.onDragOver( e ) }
				onDragLeave={ e => this.onDragLeave( e ) }
				onDrop={ e => this.onDrop( e ) }
			>
				{ children }

				<div className="DropUpload-status">
					<p className="buttons">
						<label className="DropUpload-uploader">
							<input
								type="file"
								onChange={ e => this.props.onUpload( e.target.files[0] ) }
							/>
							<a>Upload an attachment</a>
						</label>
						<span> or drop files here.</span>
					</p>
				</div>
			</div>;
		}

		return <div className="DropUpload">
			{ children }

			<div className="DropUpload-status">
				<p>
					<span className="Loading loading--active"></span>

					Uploading { file.name }…
				</p>

				<p>
					<a onClick={ () => this.onCancel() }>Cancel</a>

					{/*
					<progress
						max={ 100 }
						value={ this.state.progress }
					/>
					*/}
				</p>
			</div>
		</div>;
	}
}

DropUpload.defaultProps = {
	onCancel: () => {},
};

DropUpload.propTypes = {
	file: PropTypes.shape( {
		name: PropTypes.string.isRequired,
	} ),
	onUpload: PropTypes.func.isRequired,
};
