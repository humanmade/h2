import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import { withWidgets } from '../hocs';

import RecentPostsWidget from './Widgets/RecentPosts';
import SearchWidget from './Widgets/Search';

import './Sidebar.css';

const widgetMap = {
	default: ( { html } ) => (
		<div className="Widget" dangerouslySetInnerHTML={ { __html: html } } />
	),
	'recent-posts': RecentPostsWidget,
	search: SearchWidget,
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

		return (
			<aside
				className={ className }
				onMouseOver={ () => this.setState( { active: true } ) }
				onMouseOut={ () => this.setState( { active: false } ) }
			>
				<Slot name="Sidebar.top" />

				{ ( this.props.widgets.data || [] ).map( widget => {
					const Widget = widgetMap[ widget.type ] || widgetMap['default'];
					return (
						<Widget key={ widget.id } { ...widget } />
					);
				} ) }

				<Slot name="Sidebar.bottom" />
			</aside>
		);
	}
}

export default withWidgets( Sidebar );
