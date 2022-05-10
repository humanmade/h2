import React from 'react';
import ImageLink  from './ImageLink';

export default {
	title: 'Components|ImageLink',
}

export const Basic = () => (
	<ImageLink
	    href={ '//placehold.it/500x500' }
	    className='imagelink-anchor'
	    style={ {
			display: 'block',
			maxWidth: '200px',
		} }
	>
		<img
		    alt=''
		    src='//placehold.it/700x700'
		/>
	</ImageLink>
);
