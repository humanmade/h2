import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import { withWidgets } from '../hocs';

import RecentPostsWidget from './Widgets/RecentPosts';
import SearchWidget from './Widgets/Search';

const widgetMap = {
	default: ( { html } ) => (
		<div
			className="Widget text-[0.8em] my-[1.66667em] [&_p]:mb-[0.5em] [&_ul]:mb-[0.5em] [&_ol]:mb-[0.5em] [&_h4]:mb-[0.5em] [&_p]:mt-0 [&_ul]:mt-0 [&_ol]:mt-0 [&_h4]:mt-0"
			dangerouslySetInnerHTML={ { __html: html } }
		/>
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
		const activeClasses = active
			? 'opacity-100 transition-opacity duration-160'
			: 'opacity-10 transition-opacity duration-800 delay-400';

		return (
			<aside
				className={ `Sidebar h2-legacy-prose pt-4 pb-0 px-0 [&_h4]:text-[1.222222222em] hover:opacity-100 hover:transition-opacity hover:duration-160 max-[800px]:opacity-100 ${ activeClasses }` }
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
