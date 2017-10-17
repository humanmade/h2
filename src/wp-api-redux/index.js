import createObjectReducer from './createObjectReducer';
import createFetchObjectsActionCreator from './createFetchObjectsActionCreator';
import createFetchRelatedObjectsActionCreator
	from './createFetchRelatedObjectsActionCreator';
import createFetchObjectActionCreator from './createFetchObjectActionCreator';
import createUpdateObjectActionCreator from './createUpdateObjectActionCreator';
import createDeleteObjectActionCreator from './createDeleteObjectActionCreator';
import createCreateObjectActionCreator from './createCreateObjectActionCreator';
import createUpdateObjectWindowFilterActionCreator
	from './createUpdateObjectWindowFilterActionCreator';

class WordPress_REST_API_Redux {
	constructor( config ) {
		this.config = config;
		this.reducers = {};
		this.actions = {};
		const objects = { ...config.objects };
		Object.entries( objects ).forEach( ( [ objectName, options ] ) => {
			this.addObjectConfig( objectName, options, config.api );
		} );
	}
	addObjectConfig( objectName, options, api ) {
		this.reducers[objectName] = createObjectReducer( objectName, options );
		this.actions[objectName] = {
			fetch: createFetchObjectsActionCreator(
				objectName,
				options.route,
				api,
				options
			),
			fetchOne: createFetchObjectActionCreator(
				objectName,
				options.route,
				api,
				options
			),
			update: createUpdateObjectActionCreator(
				objectName,
				options.route,
				api,
				options
			),
			create: createCreateObjectActionCreator(
				objectName,
				options.route,
				api,
				options
			),
			delete: createDeleteObjectActionCreator(
				objectName,
				options.route,
				api,
				options
			),
			windows:      {},
			fetchRelated: {},
		};
		if ( options.windows ) {
			Object.entries( options.windows ).forEach( ( [ window, opts ] ) => {
				this.actions[objectName].windows[window] = {
					updateFilter: createUpdateObjectWindowFilterActionCreator(
						objectName,
						window
					),
				};
			} );
		}
		if ( options.relations ) {
			Object.entries(
				options.relations
			).forEach( ( [ relatedObjectName, relatedObjectOptions ] ) => {
				this.actions[objectName].related = this.actions[objectName].related
					? this.actions[objectName].related
					: {};
				this.actions[objectName].related[
					relatedObjectName
				] = createFetchRelatedObjectsActionCreator(
					objectName,
					relatedObjectName,
					relatedObjectOptions.uri,
					api,
					options
				);
			} );
		}
	}
}
export default WordPress_REST_API_Redux;
export {
	createObjectReducer,
	createFetchObjectsActionCreator,
	createFetchObjectActionCreator,
	createUpdateObjectActionCreator,
	createDeleteObjectActionCreator,
	createFetchRelatedObjectsActionCreator,
};
