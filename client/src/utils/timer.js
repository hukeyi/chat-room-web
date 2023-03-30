/**
 * 强行等待几秒
 *
 * `await waitFor(3)();`
 * @param {*} seconds 要等待多少秒
 */
export default function(seconds) {
	let ms = seconds > 0 ? seconds * 1000 : 0;
	return new Promise((resolve) => setTimeout(resolve, ms));
}
