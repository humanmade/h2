import Tasklist from '@humanmade/react-tasklist';
import Interweave from 'interweave';
import PropTypes from 'prop-types';
import React from 'react';

import { MentionMatcher } from './Mention';

import '@humanmade/react-tasklist/css/index.css';
import './Content.css';

const MATCHERS = [
	new MentionMatcher( 'mention' ),
];

class DummyComponent extends React.Component {
	render() {
		return <li className="Tasklist-Item">{ this.props.children }</li>;
	}
}

const transform = ( node, children, config ) => {
	if ( node.tagName === 'LI' && node.className === 'Tasklist-Item' ) {
		// If it's a tasklist item, wrap in a dummy component and return,
		// allowing us to use the children later.
		return <DummyComponent
			checked={ 'checked' in node.dataset }
			children={ children }
			config={ config }
			node={ node }
		/>;
	}

	if ( node.tagName === 'UL' && node.className === 'Tasklist' ) {
		// Parse out our tasks.
		const items = children.map( child => {
			if ( ! React.isValidElement( child ) || typeof child !== 'object' ) {
				return null;
			}

			if ( child.type !== DummyComponent ) {
				return {
					id:    child.key,
					label: child,
					task:  false,
				};
			}

			return {
				id:       child.key,
				label:    <React.Fragment>{ child.props.children }</React.Fragment>,
				checked:  child.props.checked,
				disabled: true,
			};
		} ).filter( Boolean );

		return <Tasklist
			disableSort={ true }
			items={ items }
			onChange={ ( ...args ) => console.log( args ) }
			onReorder={ ( ...args ) => console.log( args ) }
		/>;
	}
};

export default function Content( props ) {
	return <div className="PostContent">
		<Interweave
			commonClass={ null }
			content={ props.html }
			matchers={ MATCHERS }
			tagName="fragment"
			transform={ transform }
		/>
	</div>;
}

Content.propTypes = { html: PropTypes.string.isRequired };
