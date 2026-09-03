import React, { Suspense } from 'react';

import Notification from '../Notification';

// Gutenberg is large, so only load it when someone opts in to blocks.
const InlineBlockEditor = React.lazy( () => import( './InlineBlockEditor' ) );

export default function LazyInlineBlockEditor( props ) {
	return (
		<Suspense
			fallback={ (
				<div className="min-h-72 mb-4 border-2 border-hm-border-color bg-white p-4">
					<Notification>Loading block editor…</Notification>
				</div>
			) }
		>
			<InlineBlockEditor { ...props } />
		</Suspense>
	);
}
