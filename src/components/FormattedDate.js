import PropTypes from 'prop-types';
import React from 'react';
import { FormattedRelative } from 'react-intl';

export default function FormattedDate( props ) {
	const { date } = props;
	const dateAsDate = new Date( date );
	const hoursSinceComment = Math.floor( ( Date.now() - dateAsDate.getTime() ) / 1000 / 60 / 60 );

	return (
		<time dateTime={ date } title={ date }>
			{ hoursSinceComment < 24 ? (
				<FormattedRelative value={ date } />
			) : (
				// Canada helpfully uses YYYY-MM-DD. We do not use the ISO
				// string because we want dates to be accurate to a reader's
				// own local time zone.
				dateAsDate.toLocaleDateString( 'en-CA' )
			) }
		</time>
	);
}

FormattedDate.propTypes = {
	date: PropTypes.string.isRequired,
};
