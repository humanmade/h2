import React from 'react';
import { FormattedRelative, FormattedTime } from 'react-intl';

import Hovercard from './Hovercard';

import './TimeHovercard.css';

const DATE_FORMAT = {
	weekday: 'long',
	day: 'numeric',
	month: 'long',
	hour: 'numeric',
	minute: '2-digit',
};

const getTimezone = ( date, format = 'long' ) => {
	const tzNameFormatter = new Intl.DateTimeFormat( 'default', {
		timeZoneName: format,
	} );
	const namePart = tzNameFormatter.formatToParts( date ).find( p => p.type === 'timeZoneName');
	if ( ! namePart ) {
		return null;
	}

	return namePart.value;
}

const TimeHovercardContent = props => {
	const { date, original } = props;
	const tzName = getTimezone( date, 'long' );
	const tzShortName = getTimezone( date, 'short' );

	return (
		<div className="TimeHovercard">
			<p>Displayed in your local time ({ tzShortName } / { tzName })</p>
			<dl className="TimeHovercard__times">
				<dt>Original:</dt>
				<dd><code>{ original }</code></dd>
				<dt>UTC:</dt>
				<dd>
					<FormattedTime
						{ ...DATE_FORMAT }
						timeZone="UTC"
						timeZoneName="short"
						value={ date }
						weekday="short"
					/>
				</dd>
				<dt>Relative:</dt>
				<dd>
					<FormattedRelative
						updateInterval={ false }
						value={ date }
					/>
				</dd>
			</dl>
		</div>
	);
}

export default function TimeHovercard( props ) {
	const { children, dateTime } = props;
	const date = new Date( dateTime );

	if ( isNaN( date ) ) {
		// Fall back to children if unparseable.
		return (
			<time
				dateTime={ dateTime }
			>
				{ children }
			</time>
		);
	}

	const cardContent = () => (
		<TimeHovercardContent
			date={ date }
			original={ children }
		/>
	);

	return (
		<Hovercard
			cardContent={ cardContent }
		>
			<time
				className="TimeHovercard__time"
				dateTime={ dateTime }
			>
				<span className="TimeHovercard__clock-indicator">🕑</span>
				<FormattedTime
					{ ...DATE_FORMAT }
					value={ date }
				/>
			</time>
		</Hovercard>
	);
}
