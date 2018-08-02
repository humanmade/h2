import React from 'react';

import './LinkButton.css';

export default class LinkButton extends React.Component {
	render() {
		const { className, ...props } = this.props;

		return (
			<button
				type="button"
				{ ...props }
				className={ `LinkButton ${ className || '' }` }
			/>
		);
	}
}
