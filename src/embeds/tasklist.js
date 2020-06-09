import Tasklist from '@humanmade/react-tasklist';
import React from 'react';

import '@humanmade/react-tasklist/css/index.css';

class DummyComponent extends React.Component {
	render() {
		return <li className="Tasklist-Item">{ this.props.children }</li>;
	}
}

export const parseListItem = ( node, children ) => {
	if ( node.className !== 'Tasklist-Item' ) {
		return;
	}

	// If it's a tasklist item, wrap in a dummy component and return,
	// allowing us to use the children later.
	return (
		<DummyComponent
			checked={ 'checked' in node.dataset }
			children={ children }
			node={ node }
		/>
	);
};

export const parseList = ( node, children ) => {
	if ( node.className !== 'Tasklist' ) {
		return;
	}

	// Parse out our tasks.
	const items = children.map( child => {
		if ( ! React.isValidElement( child ) || typeof child !== 'object' ) {
			return null;
		}

		if ( child.type !== DummyComponent ) {
			return {
				id: child.key,
				label: <React.Fragment>{ child.props.children }</React.Fragment>,
				task: false,
			};
		}

		return {
			id: child.key,
			label: <React.Fragment>{ child.props.children }</React.Fragment>,
			checked: child.props.checked,
			disabled: true,
		};
	} ).filter( Boolean );

	return (
		<Tasklist
			disableSort={ true }
			items={ items }
			onChange={ () => {} }
			onReorder={ () => {} }
		/>
	);
};
