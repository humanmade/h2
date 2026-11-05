import React, { Fragment } from 'react';
import { action } from 'storybook/actions';

import Modal from './Modal';
import { OverlayContainer } from './Overlay';

export default {
	title: 'Components/Modal',
};

export const Basic = () => (
	<Fragment>
		<OverlayContainer />
		<Modal
			title="Title Text"
			onDismiss={ action( 'onDismiss' ) }
		>
			<p>Child content.</p>
		</Modal>
	</Fragment>
);
