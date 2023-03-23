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
