import { connect } from 'react-redux';
import UserDisplayName from '../components/UserDisplayName';

const mapStateToProps = ( state, props ) => {
	let user = state.users.byId[ props.userId ];

	return {
		userId: user ? user.id : 0,
		userName: user ? user.name : '',
	}
};

export default connect( mapStateToProps )( UserDisplayName );
