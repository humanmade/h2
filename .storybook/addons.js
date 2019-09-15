import addons from '@storybook/addons'
import registerRedux from 'addon-redux/register'

import '@storybook/addon-actions/register';
import '@storybook/addon-viewport/register';

registerRedux( addons );
