// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
	settings: {
		'vetur.useWorkspaceDependencies': true,
		'vetur.experimental.templateInterpolationService': true,
	},
	// **optional** default: `[{ root: './' }]`
	// support monorepos
	projects: [
		'./', // shorthand for only root.
		{
			// **required**
			// Where is your project?
			// It is relative to `vetur.config.js`.
			root: './',
			package: './package.json',
			// **optional** default: `'./.vscode/vetur/snippets'`
			// Where is vetur custom snippets folders?
			// snippetFolder: './.vscode/vetur/snippets',
			// **optional** default: `[]`
			// Register globally Vue component glob.
			// If you set it, you can get completion by that components.
			// It is relative to root property.
			// Notice: It won't actually do it. You need to use `require.context` or `Vue.component`
			// globalComponents: ['./src/components/**/*.vue'],
		},
	],
};
