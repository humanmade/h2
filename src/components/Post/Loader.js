import React from 'react';

export default function Loader( { showActions = true } ) {
	return (
		<div className="Post-Loader py-6 m-0 border-b border-hm-beige" role="status" aria-label="Loading post">
			<div className="motion-safe:animate-pulse" aria-hidden="true">
				<div className="flex items-start pb-4 max-[600px]:flex-row-reverse max-[600px]:py-2">
					<div className="shrink-0 rounded-full bg-gray-200 w-12 h-12 mr-4 max-[600px]:w-6 max-[600px]:h-6 max-[600px]:mr-0 max-[600px]:ml-2" />
					<div className="grow min-w-0">
						<div className="h-7 flex items-center mb-1.5 mr-3">
							<div className="bg-gray-200 rounded h-5 w-full max-w-80" />
						</div>
						<div className="h-4 flex items-center">
							<div className="bg-gray-200 rounded h-2.5 w-40 max-w-full" />
						</div>
					</div>
					{ showActions && <div className="shrink-0 bg-gray-200 rounded w-24 h-8 max-[600px]:hidden" /> }
				</div>
				<div className="ml-16 max-[600px]:ml-0">
					{ [ 'w-full', 'w-11/12', 'w-3/4' ].map( width => (
						<div className="h-7 flex items-center" key={ width }>
							<div className={ `bg-gray-200 rounded h-3 ${ width }` } />
						</div>
					) ) }
				</div>
			</div>
		</div>
	);
}
