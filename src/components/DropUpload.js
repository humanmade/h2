import PropTypes from 'prop-types';
import React from 'react';

import './DropUpload.css';

const ENTRY_CLASS = 'mt-0 mb-0';
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
		const wrapClasses = [
			'DropUpload',
			this.state.dropping && 'dropping',
		].filter( Boolean ).join( ' ' );

		return (
			<div
				className={ wrapClasses }
				onDragOver={ e => this.onDragOver( e ) }
				onDragLeave={ e => this.onDragLeave( e ) }
				onDrop={ e => this.onDrop( e ) }
			>
				{ children }

				<div className="DropUpload-status text-[0.8rem] text-hm-warm-grey justify-between">
					{ files.length ? (
						files.map( file => (
							<p
								key={ `${ file.name }-${ file.lastModified }` }
								className={ ENTRY_CLASS }
							>
								<span className="Loading loading--active ml-0 mr-[0.5em]"></span>

								Uploading { file.name }…
							</p>
						) )
					) : (
						<p className={ `flex items-center ${ ENTRY_CLASS }` }>
							<label className="mr-[0.3em] cursor-pointer text-hm-vibrant-blue hover:underline">
								<input
									className="hidden"
									multiple={ allowMultiple }
									type="file"
									onChange={ e => this.onInputChange( e ) }
								/>
								Upload an attachment
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
