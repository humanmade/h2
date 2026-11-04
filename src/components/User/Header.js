import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import { getUserCommentsUrl } from '../../util';
import Avatar from '../Avatar';
import Link from '../Link';
import Map from '../Map';

import UserDescription from './Description';

const TOGGLE_ITEM_CLASSES = [
	'block px-4 py-1.5 rounded text-sm leading-5 text-hm-dark-grey! hover:no-underline!',
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hm-vibrant-blue',
	'transition-colors duration-150',
].join( ' ' );

const Field = props => (
	<div>
		<dt className="text-xs font-semibold text-gray-500 mb-1">{ props.name }</dt>
		<dd className={ `m-0 text-sm leading-6 break-words ${ props.missing ? 'text-gray-500' : 'text-hm-dark-grey' }` }>{ props.children }</dd>
	</div>
);

const LocalTime = props => {
	const timeZone = props.user.meta.hm_time_timezone || ( props.user.facts && props.user.facts.timezone );
	if ( ! timeZone ) {
		const profileUrl = `${ window.H2Data.site.url }/wp-admin/profile.php?user_id=${ props.user.id }`;
		return (
			<Field
				name="Local time"
				missing
			>
				Timezone not set. <a className="underline underline-offset-2" href={ profileUrl }>Set timezone</a>
			</Field>
		);
	}

	const now = new Date();
	return (
		<React.Fragment>
			<Field name="Local time">
				<FormattedTime
					value={ now }
					timeZone={ timeZone }
				/>

				{ ', ' }

				<FormattedDate
					day="numeric"
					month="long"
					value={ now }
					timeZone={ timeZone }
				/>
			</Field>
			<Field name="Timezone">
				{ timeZone }
			</Field>
		</React.Fragment>
	);
};

const ToggleItem = ( { active, children, href } ) => (
	<li className="m-0">
		<Link
			aria-current={ active ? 'page' : undefined }
			className={ `${ TOGGLE_ITEM_CLASSES } ${ active ? 'bg-white font-semibold shadow-sm' : 'hover:bg-white/60' }` }
			href={ href }
		>
			{ children }
		</Link>
	</li>
);

export default function UserHeader( { user, view } ) {
	const isComments = view === 'comments';

	return (
		<header className="pt-8 pb-6 border-b border-hm-beige">
			<div className="flex items-start gap-6">
				<div className="grow min-w-0">
					<div className="flex items-center gap-4 min-w-0">
						<Avatar
							className="shrink-0"
							size={ 80 }
							url={ user.avatar_urls[96] }
						/>
						<div className="min-w-0">
							<h1 className="m-0 text-2xl leading-8 font-semibold normal-case break-words">{ user.name }</h1>
							<p className="m-0 text-sm leading-5 text-gray-500 break-words">@{ user.slug }</p>
							{ user.facts && user.facts.job_title && (
								<p className="mt-1 mb-0 text-sm leading-5 text-gray-600">{ user.facts.job_title }</p>
							) }
						</div>
					</div>

					<dl className="mx-0 mt-4 mb-0 grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-x-6 gap-y-3">
						<LocalTime user={ user } />
						{ user.facts && user.facts.location_name && <Field name="Location">{ user.facts.location_name }</Field> }
						{ user.facts && user.facts.pronouns && <Field name="Pronouns">{ user.facts.pronouns }</Field> }
					</dl>

					<UserDescription user={ user } />
				</div>

				{ user.facts && user.facts.location && window.H2Data.site.mapbox_key && (
					<div className="shrink-0 max-[1000px]:hidden">
						<Map
							height="135"
							location={ user.facts.location }
							width="180"
							zoom="2.0"
						/>
					</div>
				) }
			</div>

			<nav aria-label={ `${ user.name }’s activity` } className="mt-5">
				<ul className="inline-flex gap-1 m-0 p-1 list-none rounded-md bg-hm-beige/50">
					<ToggleItem active={ ! isComments } href={ user.link }>Posts</ToggleItem>
					<ToggleItem active={ isComments } href={ getUserCommentsUrl( user ) }>Comments</ToggleItem>
				</ul>
			</nav>
		</header>
	);
}
