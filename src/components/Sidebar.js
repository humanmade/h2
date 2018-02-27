import React, { Component } from 'react';

import { withApiData } from '../with-api-data';
import SearchWidget from './Widgets/Search';
import TextWidget from './Widgets/Text';

import './Sidebar.css';

const widgetMap = {
	default: ( { html } ) => <div dangerouslySetInnerHTML={ { __html: html } } />,
	search:  SearchWidget,
	text:    TextWidget,
};

export class Sidebar extends Component {
	constructor( props ) {
		super( props );

		this.state = { active: false };
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
				const Widget = widgetMap[ widget.type ] || widgetMap['default'];
				return <Widget key={widget.id} {...widget} />
			} ) }
		</aside>
	}
}

export default withApiData( props => ( { widgets: '/h2/v1/widgets?sidebar=sidebar' } ) )( Sidebar );
