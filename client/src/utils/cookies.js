/**
 *
 * tools for client-side get cookie
 * - from: https://developer.mozilla.org/en-US/docs/DOM/document.cookie
 *
 * syntaxes:
 * - cookieTool.getItem(name)
 * - cookieTool.hasItem(name)
 */
export default {
	getItem: function(sKey) {
		return (
			decodeURIComponent(
				document.cookie.replace(
					new RegExp(
						'(?:(?:^|.*;)\\s*' +
							encodeURIComponent(sKey).replace(
								/[-.+*]/g,
								'\\$&'
							) +
							'\\s*\\=\\s*([^;]*).*$)|^.*$'
					),
					'$1'
				)
			) || null
		);
	},
	hasItem: function(sKey) {
		return new RegExp(
			'(?:^|;\\s*)' +
				encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') +
				'\\s*\\='
		).test(document.cookie);
	},
};
