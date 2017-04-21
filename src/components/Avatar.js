// @flow
import React from 'react';
import './Avatar.css';

export default function Avatar(props: { url: string, size: number }) {
	const style = {
		width: props.size,
		height: props.size,
		borderRadius: props.size / 2,
	};
	return (
		<div className="Avatar">
			<img
				style={style}
				alt="User Avatar"
				src={
					props.url === ''
						? 'https://www.timeshighereducation.com/sites/default/files/byline_photos/default-avatar.png'
						: props.url
				}
			/>
		</div>
	);
}
