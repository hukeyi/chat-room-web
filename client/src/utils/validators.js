/**
 * validator for phone number
 * @param {*} value
 * @returns
 */
export const validatePhone = (value) => /^1[3-9]\d{9}$/.test(value);

/**
 * validator for password
 * length between 6 to 20, containing only
 * letters, numeric digits and underscores
 * fixme: 给 test 开了后门，记得删掉
 * @param {*} value
 * @returns
 */
export const validatePassword = (value) =>
	value === 'test' || /^[0-9a-zA-Z_]{6,20}$/.test(value);

/**
 * validator for username
 * letter, Chinese characters, numbers,
 * underscore and hythens
 * 3 to 16 long
 * @param {*} value
 * @returns
 */
export const validateUsername = (value) =>
	/^[a-zA-Z0-9_\-\u4e00-\u9fa5]{3,16}$/.test(value);
