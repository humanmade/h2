import Tasklist from '@humanmade/react-tasklist';
import React from 'react';

import '@humanmade/react-tasklist/css/index.css';

class DummyComponent extends React.Component {
	render() {
		return <li className="Tasklist-Item">{ this.props.children }</li>;
	}
}

export default props => ( node, children, config ) => {
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
					label: <React.Fragment>{ child.props.children }</React.Fragment>,
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
}
