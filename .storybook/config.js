import { addDecorator, configure } from '@storybook/react';

import rootDecorator from '../src/stories/root-decorator';

function loadStories() {
  addDecorator( rootDecorator() )
  require('../src/stories');
  require('../src/stories/editor');
}

configure(loadStories, module);
