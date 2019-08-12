import outdent from 'outdent';

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
	avatar_urls: {
		'48': 'https://secure.gravatar.com/avatar/c57c8945079831fa3c19caef02e44614?s=48&d=mm&r=g',
		'96': 'https://secure.gravatar.com/avatar/c57c8945079831fa3c19caef02e44614?s=96&d=mm&r=g',
	},
	meta: {
		h2_last_updated: now,
	},
};

export const users = [
	user,
	{
		...user,
		name: 'Joe',
		slug: 'joe',
	},
	{
		...user,
		name: 'Tom',
		slug: 'tomwillmot',
	},
];
