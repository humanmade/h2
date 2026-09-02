import React, { Suspense } from 'react';

import Notification from '../Notification';

// Gutenberg is large, so only load it when someone opts in to blocks.
const BlockEditor = React.lazy( () => import( './BlockEditor' ) );

export default function LazyBlockEditor( props ) {
	return (
		<Suspense
			fallback={ (
				<div className="p-5">
					<Notification>Loading block editor…</Notification>
				</div>
			) }
		>
			<BlockEditor { ...props } />
		</Suspense>
	);
}
