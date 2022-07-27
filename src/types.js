import { handler } from '@humanmade/repress';

export const posts = new handler( {
	type: 'posts',
	url: `${ window.wpApiSettings.root }wp/v2/posts`,
	nonce: window.wpApiSettings.nonce,
	query: {
		// Dodges Yoast SEO data computation.
		_fields: 'id,author,categories,content,date,date_gmt,excerpt,hm-utility,link,slug,status,tags,title,unprocessed_content',
	},
} );

export const comments = new handler( {
	type: 'comments',
	url: `${ window.wpApiSettings.root }wp/v2/comments`,
	nonce: window.wpApiSettings.nonce,
} );

export const reactions = new handler( {
	type: 'reactions',
	url: `${ window.wpApiSettings.root }h2/v1/reactions`,
	nonce: window.wpApiSettings.nonce,
} );

export const users = new handler( {
	type: 'users',
	url: `${ window.wpApiSettings.root }wp/v2/users`,
	nonce: window.wpApiSettings.nonce,
	query: {
		// Dodges Yoast SEO data computation.
		_fields: 'id,name,facts,link,slug,avatar_urls,meta',
	},
} );
users.registerArchive( 'me', state => ( { include: state.users.current } ) );
users.registerArchive( 'all', { per_page: 100 } );
users.updateCurrent = ( function ( data ) {
	return ( dispatch, getState ) => {
		return dispatch(
			this.updateSingle( {
				...data,
				id: getState().users.current,
			} )
		);
	};
} ).bind( users );

export const media = new handler( {
	nonce: window.wpApiSettings.nonce,
	type: 'attachment',
	url: `${ window.wpApiSettings.root }wp/v2/media`,
} );
media.uploadSingle = ( function ( file ) {
	return dispatch => {
		// Create temporary ID to allow tracking request.
		const id = '_tmp_' + this.tempId++;

		dispatch( {
			type: this.actions.createStart,
			id,
			data: {},
		} );

		const options = {
			method: 'POST',
			body: new FormData(),
		};
		options.body.append( 'file', file );
		return this.fetch( this.url, { context: 'edit' }, options )
			.then( data => {
				dispatch( {
					type: this.actions.createSuccess,
					id,
					data,
				} );
				return data.id;
			} )
			.catch( error => {
				dispatch( {
					type: this.actions.createError,
					id,
					error,
				} );

				// Rethrow for other promise handlers.
				if ( this.rethrow ) {
					throw error;
				}
			} );
	};
} ).bind( media );

export const pages = new handler( {
	nonce: window.wpApiSettings.nonce,
	type: 'pages',
	url: `${ window.wpApiSettings.root }wp/v2/pages`,
} );

const normalizePath = path => path.replace( /^\/+|\/+$/g, '' );
pages.idForPath = path => {
	// Query by slug for the final path component.
	const normalized = normalizePath( path );
	const components = normalized.split( '/' );
	pages.registerArchive( normalized, {
		slug: components.slice( -1 )[0],
	} );
	return normalized;
};

const pathForPage = page => normalizePath( page.link.substr( window.H2Data.site.home.length ) );
// Whittle down to the only page that matches fully.
pages.findPage = ( pages, path ) => {
	const normalized = normalizePath( path );
	return pages.find( page => pathForPage( page ) === normalized );
};
