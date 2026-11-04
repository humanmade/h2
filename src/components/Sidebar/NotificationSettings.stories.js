import { action } from '@storybook/addon-actions';
import React from 'react';

import { user } from '../../stories/stubs';

import { NotificationSettings } from './NotificationSettings';
import SiteHeader from './SiteHeader';

import '../../App.css';
import '../Sidebar.css';

export default {
	title: 'Interface|Sidebar/Notifications',
	parameters: {
		viewport: { defaultViewport: 'iphone6' },
	},
};

// Exercise the same drawer width and header padding as the mobile application.
export const NarrowDrawer = () => (
	<div className="App">
		<div
			className="App-sidebar"
			style={ {
				position: 'relative',
				top: 0,
				width: 'min(85vw, 360px)',
				height: 'auto',
				transform: 'none',
				visibility: 'visible',
			} }
		>
			<aside className="Sidebar">
				<SiteHeader>
					<NotificationSettings
						currentUser={ {
							...user,
							falcon_preferences: {
								wordpress: {
									post: 'all',
									comment: 'all',
								},
							},
						} }
						onLoadCurrentUser={ action( 'load current user' ) }
						onUpdateCurrentUser={ action( 'update notification preferences' ) }
					/>
				</SiteHeader>
			</aside>
		</div>
	</div>
);
