import {
	ENABLE_BETA_FEATURE,
	DISABLE_BETA_FEATURE,
} from '../actions';

const DEFAULT_STATE = {
	summary_view: false,
};

export default function features( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case ENABLE_BETA_FEATURE:
			return {
				...state,
				[ action.feature ]: true,
			};

		case DISABLE_BETA_FEATURE:
			return {
				...state,
				[ action.feature ]: false,
			};

		default:
			return state;
	}
}
