import React, { Component } from 'react';
import { withApiData } from '../with-api-data';
import ErrorBlock from './ErrorBlock';
import TextWidget from './widgets/Text';
import './Sidebar.css';

const widgetMap = { text: TextWidget };

export class Sidebar extends Component {
	render() {
		return <aside className="Sidebar">
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
