import { connect } from 'react-redux';
import Reactions from '../components/Reactions';

const mapStateToProps = state => {
	let user = state.user.byId[ Object.keys( state.user.byId )[ 0 ] ];
	return { userId: typeof user !== 'undefined' ? user.id : 0 }
};

export default connect( mapStateToProps )( Reactions );
