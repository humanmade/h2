import React from 'react';
import { withRouter } from 'react-router-dom';

import SearchInput from '../SearchInput';

function Search( props ) {
	return (
		<div>
			{ props.title && <h4>{ props.title }</h4> }

			<SearchInput
				onSearch={ s => props.history.push( s ? `/search/${ s }` : '/' ) }
				value={ null }
			/>
		</div>
	);
}

export default withRouter( Search );
