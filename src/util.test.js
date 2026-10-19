import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getUpdateBody } from './util.js';

test( 'update body keeps the current status', () => {
	const body = getUpdateBody( '<p>Hi</p>', 'Hi' );

	assert.deepEqual( body, {
		content: '<p>Hi</p>',
		unprocessed_content: 'Hi',
	} );
	assert.equal( 'status' in body, false );
} );
