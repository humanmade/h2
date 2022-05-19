import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

const caches = {};

class ApiCache {
	constructor( fetch, initialData = {} ) {
		this.fetch = fetch;
		this.cache = { ...initialData };
		this.eventSubscribers = {};
	}
	get( url, params ) {

		const promise = this.fetch( url, params )
			.then( r => this.handleResponse( r ) )
			.then( response => {
				this.setCache( url, response )
				this.trigger( url, response )
			} )
			.catch( error => {
				this.setCache( url, error )
				this.trigger( url, error )
			} )

		this.setCache( url, 'pending' )

		return promise;
	}
	getCache( url ) {
		return this.cache[ url ];
	}
	setCache( url, response ) {
		this.cache[ url ] = response;
	}
	handleResponse( response ) {
		return response.text().then( responseText => {
			try {
				var json = JSON.parse( responseText )
			} catch ( e ) {
				throw new Error( responseText );
			}

			if ( response.status > 299 ) {
				throw new Error( json.message );
			}
			return json;
		} )
	}
	on( url, callback ) {
		this.eventSubscribers[ url ] = this.eventSubscribers[ url ] || [];
		this.eventSubscribers[ url ].push( callback );

		if ( this.getCache( url ) === 'pending' ) {
			return;
		}
		if ( this.getCache( url ) ) {
			return callback( this.getCache( url ) );
		}
		this.get( url )
	}
	trigger( url, response ) {
		if ( ! this.eventSubscribers[url] ) {
			console.log( 'no subscribers found for url', url )
		}
		this.eventSubscribers[url].map( f => f( response ) )
	}
	removeCache( url ) {
		delete this.cache[ url ];
	}
}

export class Provider extends Component {
	static childContextTypes = {
		api:      PropTypes.func.isRequired,
		apiCache: PropTypes.object.isRequired,
	};
	constructor( props ) {
		super( props )
		if ( props.cacheKey ) {
			if ( ! caches[ props.cacheKey ] ) {
				caches[ props.cacheKey ] = new ApiCache( props.fetch, props.initialData );
			}
			this.apiCache = caches[ props.cacheKey ];
		} else {
			this.apiCache = new ApiCache( props.fetch, props.initialData );
		}
	}
	getChildContext() {
		return { api: this.props.fetch, apiCache: this.apiCache };
	}
	render() {
		return this.props.children;
	}
}

export const withApiData = mapPropsToData => WrappedComponent => {
	class APIDataComponent extends Component {
		static contextTypes = {
			api:      PropTypes.func.isRequired,
			apiCache: PropTypes.object.isRequired,
		};
		constructor( props ) {
			super( props );

			const dataMap = mapPropsToData( this.props );
			const keys = Object.keys( dataMap );
			const dataProps = {};
			keys.forEach( key => {
				dataProps[ key ] = {
					isLoading: true,
					error:     null,
					data:      null,
				}
			} );
			this.state = dataProps;
		}

		componentDidMount() {
			this.unmounted = false;
			this.updateProps( this.props );
		}

		componentWillUnmount() {
			this.unmounted = true;
		}

		componentDidUpdate( prevProps ) {
			const oldDataMap = mapPropsToData( prevProps );
			const newDataMap = mapPropsToData( this.props );
			if ( isEqual( oldDataMap, newDataMap ) ) {
				return;
			}

			// When the `mapPropsToData` function returns a different
			// result, reset all the data to empty and loading.
			const keys = Object.keys( newDataMap );
			const dataProps = {};
			keys.forEach( key => {
				dataProps[ key ] = {
					url:       null,
					isLoading: true,
					error:     null,
					data:      null,
				}
			} );
			this.setState( dataProps, () => this.updateProps( this.props ) );
		}

		updateProps( props ) {
			const dataMap = mapPropsToData( props );

			Object.entries( dataMap ).forEach( ( [ key, endpoint ] ) => {
				if ( ! endpoint ) {
					return;
				}
				this.setState( {
					[ key ]: {
						isLoading: true,
						error:     null,
						...this.state[ key ],
						url: endpoint,
					},
				} )
				this.context.apiCache.on( endpoint, data => {
					let error = null;
					if ( this.unmounted ) {
						return data;
					}

					if ( data instanceof Error ) {
						error = data;
						data = null;
					}
					this.setState( state => {
						// Check for race conditions
						if ( state[ key ].url !== endpoint ) {
							return {};
						}

						const prop = {
							error,
							isLoading: false,
							data,
						};
						return { [ key ]: prop };
					} );
				} )
			} );
		}
		onFetch( ...args ) {
			return this.context.api( ...args );
		}
		onRefreshData() {
			this.onInvalidateData();
		}
		onInvalidateData() {
			const dataMap = mapPropsToData( this.props );
			Object.entries( dataMap ).forEach( ( [ key, endpoint ] ) => {
				this.context.apiCache.removeCache( endpoint )
			} );
			this.updateProps( this.props );
		}

		onInvalidateDataForUrl( url ) {
			this.context.apiCache.removeCache( url )
			this.updateProps( this.props );
			this.context.apiCache.get( url );
		}

		onPost( url, data ) {
			return this.onFetch( url, {
				headers: {
					Accept:         'application/json',
					'Content-Type': 'application/json',
				},
				body:   JSON.stringify( data ),
				method: 'POST',
			} ).then( response => {
				return response.text().then( responseText => {
					try {
						var json = JSON.parse( responseText )
					} catch( e ) {
						throw new Error( responseText );
					}
					return json;
				} )
			} )
		}

		getWrappedInstance() {
			return this.wrapperRef;
		}

		render() {
			return (
				<WrappedComponent
					{ ...this.props }
					{ ...this.state }
					fetch={( ...args ) => this.onFetch( ...args )}
					post={ (...args) => this.onPost(...args)}
					ref={ref => this.wrapperRef = ref}
					refreshData={ ( ...args ) => this.onRefreshData( ...args ) }
					invalidateData={ () => this.onInvalidateData() }
					invalidateDataForUrl={ ( ...args ) => this.onInvalidateDataForUrl( ...args ) }
				/>
			);
		}
	}

	// Derive display name from original component
	const { displayName = WrappedComponent.name || 'Component' } = WrappedComponent;
	APIDataComponent.displayName = `apiData(${ displayName })`;

	return APIDataComponent;
}

export class WithApiData extends Component {
	static contextTypes = {
		api:      PropTypes.func.isRequired,
		apiCache: PropTypes.object.isRequired,
	};
	constructor( props ) {
		super( props );
		const dataMap = props.data;
		const keys = Object.keys( dataMap );
		const dataProps = {};
		keys.forEach( key => {
			dataProps[ key ] = {
				isLoading: true,
				error:     null,
				data:      null,
			}
		} );
		this.state = dataProps;
	}

	componentDidMount() {
		this.unmounted = false;
		this.updateProps( this.props );
	}

	componentWillUnmount() {
		this.unmounted = true;
	}

	componentDidUpdate( prevProps ) {
		const oldDataMap = prevProps.data;
		const newDataMap = this.props.data;
		if ( isEqual( oldDataMap, newDataMap ) ) {
			return;
		}
		// When the `mapPropsToData` function returns a different
		// result, reset all the data to empty and loading.
		const keys = Object.keys( newDataMap );
		const dataProps = {};
		keys.forEach( key => {
			dataProps[ key ] = {
				isLoading: true,
				error:     null,
				data:      null,
			}
		} );
		this.setState( dataProps, () => this.updateProps( this.props ) );
	}

	invalidateData() {
		const dataMap = this.props.data;
		Object.entries( dataMap ).forEach( ( [ key, endpoint ] ) => {
			this.context.apiCache.removeCache( endpoint )
		} );
		this.updateProps( this.props );
	}

	updateProps( props ) {
		const dataMap = props.data;

		Object.entries( dataMap ).forEach( ( [ key, endpoint ] ) => {
			if ( ! endpoint ) {
				return;
			}
			this.setState( {
				[ key ]: {
					isLoading: true,
					error:     null,
					data: null,
					url: endpoint,
				},
			} );
			this.context.apiCache.on( endpoint, data => {
				let error = null;
				if ( this.unmounted ) {
					return data;
				}

				if ( data instanceof Error ) {
					error = data;
					data = null;
				}
				this.setState( state => {
					// Check for race conditions
					if ( state[ key ].url !== endpoint ) {
						return {};
					}

					const prop = {
						error,
						isLoading: false,
						data,
					};
					return { [ key ]: prop };
				} );
			} )
		} );
	}

	render() {
		return this.props.render( { ...this.state } )
	}
}
