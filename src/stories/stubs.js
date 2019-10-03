import outdent from 'outdent';

import omgEmoji from './assets/omg.png';
import polyglotsEmoji from './assets/polyglots.png';

const now = new Date().toISOString().replace( 'Z', '' );

export const title = {
	rendered: 'Tecum optime, deinde etiam cum mediocri amico.',
};
export const editableTitle = {
	...title,
	raw: 'Tecum optime, deinde etiam cum mediocri amico.',
};

export const content = {
	count: 330,
	rendered: outdent`
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Collige omnia, quae soletis: Praesidium amicorum. Si est nihil nisi corpus, summa erunt illa: valitudo, vacuitas doloris, pulchritudo, cetera. Duo Reges: constructio interrete. Itaque hic ipse iam pridem est reiectus; Nemo nostrum istius generis asotos iucunde putat vivere. </p>

		<ul>
			<li>Praetereo multos, in bis doctum hominem et suavem, Hieronymum, quem iam cur Peripateticum appellem nescio.</li>
			<li>In schola desinis.</li>
			<li>Itaque primos congressus copulationesque et consuetudinum instituendarum voluntates fieri propter voluptatem;</li>
			<li>Neque enim civitas in seditione beata esse potest nec in discordia dominorum domus;</li>
		</ul>


		<ol>
			<li>Quae si potest singula consolando levare, universa quo modo sustinebit?</li>
			<li>Itaque nostrum est-quod nostrum dico, artis est-ad ea principia, quae accepimus.</li>
			<li>Quid enim ab antiquis ex eo genere, quod ad disserendum valet, praetermissum est?</li>
			<li>Ex eorum enim scriptis et institutis cum omnis doctrina liberalis, omnis historia.</li>
			<li>Num igitur utiliorem tibi hunc Triarium putas esse posse, quam si tua sint Puteolis granaria?</li>
		</ol>


		<blockquote cite="http://loripsum.net">
			Multosque etiam dolores curationis causa perferant, ut, si ipse usus membrorum non modo non maior, verum etiam minor futurus sit, eorum tamen species ad naturam revertatur?
		</blockquote>


		<p><i>Scrupulum, inquam, abeunti;</i> Nunc de hominis summo bono quaeritur; <code>Si id dicis, vicimus.</code> Plane idem, inquit, et maxima quidem, qua fieri nulla maior potest. Satis est tibi in te, satis in legibus, satis in mediocribus amicitiis praesidii. <code>Qui est in parvis malis.</code> Ut optime, secundum naturam affectum esse possit. </p>

		<pre>Hanc initio institutionem confusam habet et incertam, ut
		tantum modo se tueatur, qualecumque sit, sed nec quid sit
		nec quid possit nec quid ipsius natura sit intellegit.

		Si ad corpus pertinentibus, rationes tuas te video
		compensare cum istis doloribus, non memoriam corpore
		perceptarum voluptatum;
		</pre>


		<p><i>At enim hic etiam dolore.</i> Qua igitur re ab deo vincitur, si aeternitate non vincitur? Quid enim ab antiquis ex eo genere, quod ad disserendum valet, praetermissum est? <i>Beatus sibi videtur esse moriens.</i> Sint modo partes vitae beatae. Illis videtur, qui illud non dubitant bonum dicere -; An haec ab eo non dicuntur? </p>
	`,
};

export const editableContent = {
	...content,
	raw: outdent`
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Collige omnia, quae soletis: Praesidium amicorum. Si est nihil nisi corpus, summa erunt illa: valitudo, vacuitas doloris, pulchritudo, cetera. Duo Reges: constructio interrete. Itaque hic ipse iam pridem est reiectus; Nemo nostrum istius generis asotos iucunde putat vivere.

		-   Praetereo multos, in bis doctum hominem et suavem, Hieronymum, quem iam cur Peripateticum appellem nescio.
		-   In schola desinis.
		-   Itaque primos congressus copulationesque et consuetudinum instituendarum voluntates fieri propter voluptatem;
		-   Neque enim civitas in seditione beata esse potest nec in discordia dominorum domus;

		1.  Quae si potest singula consolando levare, universa quo modo sustinebit?
		2.  Itaque nostrum est-quod nostrum dico, artis est-ad ea principia, quae accepimus.
		3.  Quid enim ab antiquis ex eo genere, quod ad disserendum valet, praetermissum est?
		4.  Ex eorum enim scriptis et institutis cum omnis doctrina liberalis, omnis historia.
		5.  Num igitur utiliorem tibi hunc Triarium putas esse posse, quam si tua sint Puteolis granaria?

		> Multosque etiam dolores curationis causa perferant, ut, si ipse usus membrorum non modo non maior, verum etiam minor futurus sit, eorum tamen species ad naturam revertatur?

		*Scrupulum, inquam, abeunti;* Nunc de hominis summo bono quaeritur; \`Si id dicis, vicimus.\` Plane idem, inquit, et maxima quidem, qua fieri nulla maior potest. Satis est tibi in te, satis in legibus, satis in mediocribus amicitiis praesidii. \`Qui est in parvis malis.\` Ut optime, secundum naturam affectum esse possit.

		Hanc initio institutionem confusam habet et incertam, ut
		tantum modo se tueatur, qualecumque sit, sed nec quid sit
		nec quid possit nec quid ipsius natura sit intellegit.

		Si ad corpus pertinentibus, rationes tuas te video
		compensare cum istis doloribus, non memoriam corpore
		perceptarum voluptatum;

		*At enim hic etiam dolore.* Qua igitur re ab deo vincitur, si aeternitate non vincitur? Quid enim ab antiquis ex eo genere, quod ad disserendum valet, praetermissum est? *Beatus sibi videtur esse moriens.* Sint modo partes vitae beatae. Illis videtur, qui illud non dubitant bonum dicere -; An haec ab eo non dicuntur?
	`,
};

export const htmlTester = `
<h2>Headings</h2>
<h1>Header one</h1>
<h2>Header two</h2>
<h3>Header three</h3>
<h4>Header four</h4>
<h5>Header five</h5>
<h6>Header six</h6>
<h2>Blockquotes</h2>
<p>Single line blockquote:</p>
<blockquote><p>Stay hungry. Stay foolish.</p></blockquote>
<p>Multi line blockquote with a cite reference:</p>
<blockquote><p>People think focus means saying yes to the thing you’ve got to focus on. But that’s not what it means at all. It means saying no to the hundred other good ideas that there are. You have to pick carefully. I’m actually as proud of the things we haven’t done as the things I have done. Innovation is saying no to 1,000 things. <cite>Steve Jobs – Apple Worldwide Developers’ Conference, 1997</cite></p></blockquote>
<h2>Tables</h2>
<table>
<tbody>
<tr>
<th>Employee</th>
<th class="views">Salary</th>
<th></th>
</tr>
<tr class="odd">
<td><a href="http://john.do/">John Saddington</a></td>
<td>$1</td>
<td>Because that’s all Steve Job’ needed for a salary.</td>
</tr>
<tr class="even">
<td><a href="http://tommcfarlin.com/">Tom McFarlin</a></td>
<td>$100K</td>
<td>For all the blogging he does.</td>
</tr>
<tr class="odd">
<td><a href="http://jarederickson.com/">Jared Erickson</a></td>
<td>$100M</td>
<td>Pictures are worth a thousand words, right? So Tom x 1,000.</td>
</tr>
<tr class="even">
<td><a href="http://chrisam.es/">Chris Ames</a></td>
<td>$100B</td>
<td>With hair like that?! Enough said…</td>
</tr>
</tbody>
</table>
<h2>Definition Lists</h2>
<dl>
<dt>Definition List Title</dt>
<dd>Definition list division.</dd>
<dt>Startup</dt>
<dd>A startup company or startup is a company or temporary organization designed to search for a repeatable and scalable business model.</dd>
<dt>#dowork</dt>
<dd>Coined by Rob Dyrdek and his personal body guard Christopher “Big Black” Boykins, “Do Work” works as a self motivator, to motivating your friends.</dd>
<dt>Do It Live</dt>
<dd>I’ll let Bill O’Reilly will <a title="We'll Do It Live" href="https://www.youtube.com/watch?v=O_HyZ5aW76c">explain</a> this one.</dd>
</dl>
<h2>Unordered Lists (Nested)</h2>
<ul>
<li>List item one
<ul>
<li>List item one
<ul>
<li>List item one</li>
<li>List item two</li>
<li>List item three</li>
<li>List item four</li>
</ul>
</li>
<li>List item two</li>
<li>List item three</li>
<li>List item four</li>
</ul>
</li>
<li>List item two</li>
<li>List item three</li>
<li>List item four</li>
</ul>
<h2>Ordered List (Nested)</h2>
<ol>
<li>List item one
<ol>
<li>List item one
<ol>
<li>List item one</li>
<li>List item two</li>
<li>List item three</li>
<li>List item four</li>
</ol>
</li>
<li>List item two</li>
<li>List item three</li>
<li>List item four</li>
</ol>
</li>
<li>List item two</li>
<li>List item three</li>
<li>List item four</li>
</ol>
<h2>HTML Tags</h2>
<p>These supported tags come from the WordPress.com code <a title="Code" href="http://en.support.wordpress.com/code/">FAQ</a>.</p>
<p><strong>Address Tag</strong></p>
<address>1 Infinite Loop<br>
Cupertino, CA 95014<br>
United States</address>
<p><strong>Anchor Tag (aka. Link)</strong></p>
<p>This is an example of a <a title="Apple" href="http://apple.com">link</a>.</p>
<p><strong>Abbreviation Tag</strong></p>
<p>The abbreviation <abbr title="Seriously">srsly</abbr> stands for “seriously”.</p>
<p><strong>Acronym Tag</strong></p>
<p>The acronym <acronym title="For The Win">ftw</acronym> stands for “for the win”.</p>
<p><strong>Big Tag</strong></p>
<p>These tests are a <big>big</big> deal, but this tag is no longer supported in HTML5.</p>
<p><strong>Cite Tag</strong></p>
<p>“Code is poetry.” —<cite>Automattic</cite></p>
<p><strong>Code Tag</strong></p>
<p>You will learn later on in these tests that <code>word-wrap: break-word;</code> will be your best friend.</p>
<p><strong>Delete Tag</strong></p>
<p>This tag will let you <del>strikeout text</del>, but this tag is no longer supported in HTML5 (use the <code>&lt;strike&gt;</code> instead).</p>
<p><strong>Emphasize Tag</strong></p>
<p>The emphasize tag should <em>italicize</em> text.</p>
<p><strong>Insert Tag</strong></p>
<p>This tag should denote <ins>inserted</ins> text.</p>
<p><strong>Keyboard Tag</strong></p>
<p>This scarsly known tag emulates <kbd>keyboard text</kbd>, which is usually styled like the <code>&lt;code&gt;</code> tag.</p>
<p><strong>Preformatted Tag</strong></p>
<p>This tag styles large blocks of code.</p>
<pre>.post-title {
	margin: 0 0 5px;
	font-weight: bold;
	font-size: 38px;
	line-height: 1.2;
}</pre>
<p><strong>Quote Tag</strong></p>
<p><q>Developers, developers, developers…</q> –Steve Ballmer</p>
<p><strong>Strong Tag</strong></p>
<p>This tag shows <strong>bold<strong> text.</strong></strong></p>
<p><strong>Subscript Tag</strong></p>
<p>Getting our science styling on with H<sub>2</sub>O, which should push the “2” down.</p>
<p><strong>Superscript Tag</strong></p>
<p>Still sticking with science and Albert Einstein’s&nbsp;E = MC<sup>2</sup>, which should lift the “2” up.</p>
<p><strong>Teletype Tag</strong></p>
<p>This rarely used tag emulates <tt>teletype text</tt>, which is usually styled like the <code>&lt;code&gt;</code> tag.</p>
<p><strong>Variable Tag</strong></p>
<p>This allows you to denote <var>variables</var>.</p>
`;

export const comment = {
	id: 1,
	post: 1,
	date_gmt: now,
	author: 1,
	parent: 0,
	content,
};

export const post = {
	id: 1,
	date_gmt: now,
	author: 1,
	categories: [],
	link: 'http://example.com/2018/01/01/tecum-optime/',
	title,
	content,
	related: {
		comments: {
			items: [],
			isLoading: false,
			hasLoaded: false,
		},
	},
};

export const editablePost = {
	...post,
	title: editableTitle,
	content: editableContent,
	meta: {
		unprocessed_content: editableContent.raw,
	},
};

export const user = {
	id: 1,
	name: 'Noel',
	slug: 'noel',
	link: 'http://example.com/',
	avatar_urls: {
		'48': 'https://www.gravatar.com/avatar/1?d=identicon&f=y&s=48',
		'96': 'https://www.gravatar.com/avatar/1?d=identicon&f=y&s=96',
	},
	meta: {
		h2_last_updated: now,
		hm_time_timezone: 'Europe/Zurich',
	},
	facts: {
		job_title: 'Chief Growth Officer',
		short_bio: 'This is a short description of the user.',
		long_description: 'This is a long description of the user.',
		location: '47.3769,8.5417',
	},
};

export const users = [
	user,
	{
		...user,
		id: 2,
		name: 'Joe',
		slug: 'joe',
		avatar_urls: {
			'48': 'https://www.gravatar.com/avatar/2?d=identicon&f=y&s=48',
			'96': 'https://www.gravatar.com/avatar/2?d=identicon&f=y&s=96',
		},
	},
	{
		...user,
		id: 3,
		name: 'Tom',
		slug: 'tomwillmot',
		avatar_urls: {
			'48': 'https://www.gravatar.com/avatar/3?d=identicon&f=y&s=48',
			'96': 'https://www.gravatar.com/avatar/3?d=identicon&f=y&s=96',
		},
	},
];

export const emoji = [
	{
		colons: ':smile:',
		native: '😃',
	},
	{
		colons: ':laugh:',
		native: '😄',
	},
	{
		colons: ':polyglots:',
		imageUrl: polyglotsEmoji,
	},
	{
		colons: ':tongue_poking_out_face:',
		native: '😛',
	},
	{
		colons: ':omg:',
		imageUrl: omgEmoji,
	},
];
