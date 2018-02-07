import React from 'react';

import Completion from './Completion';
import { withApiData } from '../with-api-data';

import './MentionCompletion.css';

const MentionCompletion = props => {
	const renderItem = ( { item, selected, onSelect } ) => <li
		key={ item.slug }
		className={ selected ? 'MentionCompletion-item selected' : 'MentionCompletion-item' }
		onClick={ onSelect }
	>
		<img
			alt=""
			className="avatar"
			src={ item.avatar_urls[48] }
		/>
		<span className="name">{ item.name }</span>
		<span className="username">@{ item.slug }</span>
	</li>;

	return <Completion
		{ ...props }
		items={ Object.values( props.users.data || [] ) }
		insert={ ( item, props ) => `${ props.trigger }${ item.slug } ` }
		matcher={ ( item, search ) => `${ item.slug } ${ item.name }`.toLowerCase().indexOf( search.toLowerCase() ) >= 0 }
		renderItem={ renderItem }
	/>;
};

export default withApiData( props => ( { users: '/wp/v2/users?per_page=100' } ) )( MentionCompletion );
