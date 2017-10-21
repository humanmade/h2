import { connect } from 'react-redux';

import Editor from '../components/Editor';

const mapStateToProps = state => ( {
	users: state.users.byId,
} );

export default connect(
	mapStateToProps,
	null,
	null,
	{ withRef: true }
)( Editor );
