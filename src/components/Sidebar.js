import React, { Component } from 'react';

import { withApiData } from '../with-api-data';
import ErrorBlock from './ErrorBlock';
import SearchWidget from './widgets/Search';
import TextWidget from './widgets/Text';

import './Sidebar.css';

const widgetMap = {
	search: SearchWidget,
	text: TextWidget,
};

export class Sidebar extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			active: false,
		};
	}

	render() {
		const { active } = this.state;
		const className = `Sidebar ${ active ? 'active' : '' }`;

		return <aside
			className={ className }
			onMouseOver={ () => this.setState( { active: true } ) }
			onMouseOut={ () => this.setState( { active: false } ) }
		>
			{ ( this.props.widgets.data || [] ).map( widget => {
				const Widget = widgetMap[ widget.type ];
				if ( ! Widget ) {
					return <TextWidget key={widget.id} text={ widget.html } />
				}
				return <Widget key={widget.id} {...widget} />
			} ) }
		</aside>
	}
}

export default withApiData( props => ( { widgets: '/h2/v1/widgets?sidebar=sidebar' } ) )( Sidebar );
