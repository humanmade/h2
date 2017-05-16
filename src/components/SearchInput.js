// @flow
import React from 'react';
import './SearchInput.css';

export default function Post(
	props: {
		onSearch: Function,
		value: string,
	}
) {
	return (
		<form
			className="SearchInput"
			onSubmit={e => {
				e.preventDefault();
				props.onSearch(e.target.querySelector('input').value);
			}}
		>
			<input type="search" placeholder="Search..." />
		</form>
	);
}
