import React from 'react';

import SearchInput from '../SearchInput';

function Search( props ) {
	return (
		<div className="Widget">
			{ props.title && <h4>{ props.title }</h4> }

			<SearchInput small />
		</div>
	);
}

export default Search;
