import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Picker } from 'emoji-mart';

import 'emoji-mart/css/emoji-mart.css';
import './EmojiPicker.css';

export const customEmoji = Object.values( window.H2Data.site.emoji || {} );

class PickerWrap extends Component {
	constructor( props ) {
		super( props );

		this.container = document.createElement( 'div' );
		this.mediaQuery = window.matchMedia( '(max-width: 600px)' );
		this.state = {
			needsPortal: this.mediaQuery.matches,
		};
		this.mediaQuery.addListener( this.onQueryChange );
	}

	componentDidMount() {
		document.body.appendChild( this.container );
	}

	componentWillUnmount() {
		document.body.removeChild( this.container );
	}

	onClose = e => {
		if ( ! this.contentEl ) {
			return;
		}

		if ( this.contentEl.contains( e.target ) ) {
			return;
		}

		e.preventDefault();

		this.props.onClose();
	}

	onQueryChange = e => {
		this.setState( { needsPortal: e.matches } );
	}

	render() {
		const { needsPortal } = this.state;

		if ( ! needsPortal ) {
			return (
				<div className="EmojiPicker">
					{ this.props.children }
				</div>
			);
		}

		return ReactDOM.createPortal(
			<div
				className="EmojiPicker EmojiPicker--mobile"
				onClick={ this.onClose }
			>
				<div
					ref={ r => this.contentEl = r }
				>
					{ this.props.children }
				</div>
			</div>,
			this.container,
		);
	}
}

export default function EmojiPicker( props ) {
	return (
		<PickerWrap
			onClose={ props.onClose }
		>
			<Picker
				key="picker"
				onClick={ props.onSelect }
				title={ false }
				emoji="upside_down_face"
				autoFocus={ props.autoFocus }
				color="#D24632"
				custom={ customEmoji }
				set="twitter"
			/>
		</PickerWrap>
	);
}

EmojiPicker.defaultProps = {
	autoFocus: true,
};

EmojiPicker.propTypes = {
	autoFocus: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired,
};
