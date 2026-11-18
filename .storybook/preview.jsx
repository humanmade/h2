import '../src/tailwind.css';
import '../src/styles/juniper.scss';
import rootDecorator from '../src/stories/root-decorator';

export default {
	decorators: [ rootDecorator() ],
	parameters: {
		backgrounds: {
			options: {
				checkerboard: {
					name: 'Checkerboard',
					value: 'conic-gradient(#f3f3f3 25%, transparent 0 50%, #f3f3f3 0 75%, transparent 0) 0 0 / 20px 20px',
				},
				'white': { name: 'White', value: '#fff' },
				'black': { name: 'Black', value: '#000' },
				'red': { name: 'red', value: '#FF424A' },
				'blue': { name: 'blue', value: '#7DC9DA' },
				'warm-grey': { name: 'warm-grey', value: '#504C4C' },
				'dark-grey': { name: 'dark-grey', value: '#353535' },
				'beige': { name: 'beige', value: '#F4EFE6' },
				'medium-grey': { name: 'medium-grey', value: '#737373' },
				'light-grey': { name: 'light-grey', value: '#f7f7f7' },
				'brown': { name: 'brown', value: '#4F4641' },
				'red-light': { name: 'red-light', value: '#e06857' },
				'red-dark': { name: 'red-dark', value: '#b34332' },
			},
		},
	},
	initialGlobals: { backgrounds: { value: 'checkerboard' } },
};
