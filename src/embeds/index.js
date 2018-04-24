import tasklist from './tasklist';

const transformers = [
	tasklist,
];

export default function getEmbedTransform( props ) {
	const transforms = transformers.map( func => func( props ) );

	return ( node, children, config ) => {
		for ( let i = 0; i < transforms.length; i++ ) {
			const transform = transforms[ i ];
			const result = transform( node, children, config );

			if ( result !== undefined ) {
				return result;
			}
		}
	};
}
