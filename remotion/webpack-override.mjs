/** @type {import('@remotion/bundler').WebpackOverrideFn} */
export const webpackOverride = (config) => {
	return {
		...config,
		resolve: {
			...config.resolve,
			alias: {
				...config.resolve?.alias,
				'@remotion/google-fonts/Inter': false,
			},
		},
	};
};
