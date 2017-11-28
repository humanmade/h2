import React, { Component } from 'react';
import PropTypes from 'prop-types';

const requests = {};

export class RESTAPIContext extends Component {
	static childContextTypes = {
		api: PropTypes.object.isRequired,
	};
	getChildContext() {
		return { api: this.props.api };
	}
	render() {
		return this.props.children;
	}
}

export const WithApiData = props => (
	withApiData( props.mapPropsToData )( props.children )
)

export const withApiData = mapPropsToData => WrappedComponent => {
	class APIDataComponent extends Component {
		static contextTypes = {
			api: PropTypes.object.isRequired,
		};
		constructor( props ) {
			super( props );
			this.state = { dataProps: this.getPropsMapping() };
		}

		componentDidMount() {
			this.fetchData( this.props );
		}

		componentWillUnmount() {
			this.unmounted = true;
		}

		getPropsMapping() {
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
			return dataProps;
		}

		componentWillReceiveProps( nextProps ) {
			this.fetchData( nextProps );
		}

		fetchData( props ) {
			const dataMap = mapPropsToData( props );
			const dataProps = { ...this.state.dataProps };

			Object.entries( dataMap ).forEach( ( [ key, endpoint ] ) => {
				const handleData = data => {
					if ( this.unmounted ) {
						return data;
					}
					const prop = {
						error:     null,
						isLoading: false,
						data,
					};
					this.setState( {
						dataProps: {
							...this.state.dataProps,
							[ key ]: prop,
						},
					} );
					return data;
				};
				const handleError = error => {
					if ( this.unmounted ) {
						return error;
					}
					const data = {
						error,
						isLoading: false,
						data:      null,
					};
					this.setState( {
						dataProps: {
							...this.state.dataProps,
							[ key ]: data,
						},
					} )
				};

				const cacheKey = `GET::${endpoint}`;
				dataProps[ key ] = {
					isLoading: true,
					error:     null,
					data:      null,
				};
				if ( requests[ cacheKey ] ) {
					return requests[ cacheKey ].then( handleData ).catch( handleError )
				} else if ( window.wpRestApiData && window.wpRestApiData[ cacheKey ] ) {
					dataProps[ key ] = {
						isLoading: false,
						error:     null,
						data:      window.wpRestApiData[ cacheKey ],
					};
				} else {
					return requests[ cacheKey ] = this.context.api.get( endpoint ).then( handleData ).catch( handleError )
				}

			} );
			this.setState( { dataProps } );
		}

		render() {
			return (
				<WrappedComponent
					{ ...this.props }
					{ ...this.state.dataProps }
				/>
			);
		}
	}

	// Derive display name from original component
	const { displayName = WrappedComponent.name || 'Component' } = WrappedComponent;
	APIDataComponent.displayName = `apiData(${ displayName })`;

	return APIDataComponent;
};
