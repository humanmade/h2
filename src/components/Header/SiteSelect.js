import React, { Fragment } from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import Dropdown from './Dropdown';
import Logo from './Logo';

import './SiteSelect.css';

export default class SiteSelect extends React.Component {
	render() {
		const label = <Fragment><Logo /> { window.H2Data.site.name }</Fragment>;
		return <Dropdown
			className="SiteSelect"
			label={ label }
		>
			<ul>
				<Switch>
					<Route exact path="/" />
					<Route>
						<li><Link to="/">&larr; Back to home</Link></li>
					</Route>
				</Switch>
				<li>
					<a href="https://updates.hmn.md/">
						<span className="SiteSelect-site-name">Updates</span>
						<span className="SiteSelect-site-desc">Main company H2.</span>
					</a>
				</li>
				<li>
					<a href="https://dev.hmn.md/">
						<span className="SiteSelect-site-name">Dev</span>
						<span className="SiteSelect-site-desc">Everything development-related.</span>
					</a>
				</li>
				<li>
					<a href="https://servers.hmn.md/">
						<span className="SiteSelect-site-name">Servers</span>
						<span className="SiteSelect-site-desc">Hosting discussion.</span>
					</a>
				</li>
				<li><a href="https://money.hmn.md/">Money</a></li>
				<li><a href="https://hiring.hmn.md/">Hiring</a></li>
				<li><a href="https://pm.hmn.md/">Project Management</a></li>
			</ul>
		</Dropdown>;
	}
}
