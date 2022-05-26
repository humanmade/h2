import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

import Notification from '../Notification';

const Editor = React.lazy( () => import( './index' ) );

const LazyEditor = props => (
	<Suspense fallback={ (
		<Notification>Loading…</Notification>
	) }>
		<Editor { ...props } />
	</Suspense>
);

LazyEditor.propTypes = {
	previewComponent: PropTypes.func,
	saveText: PropTypes.string,
	submitText: PropTypes.string,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func.isRequired,
};

export default LazyEditor;
