/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 23:57:23
 * @Last Modified by:   Hu Keyi
 * @Last Modified time: 2021-05-05 23:57:23
 */
// 按照传入的fmt格式，格式化Date对象
export function formatDate(fmt, time) {
	if (!time) {
		time = new Date();
	}
	const o = {
		'M+': time.getMonth() + 1, //月份
		'd+': time.getDate(), //日
		'h+': time.getHours(), //小时
		'm+': time.getMinutes(), //分
		's+': time.getSeconds(), //秒
		'q+': Math.floor((time.getMonth() + 3) / 3), //季度
		S: time.getMilliseconds(), //毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(
			RegExp.$1,
			(time.getFullYear() + '').substr(4 - RegExp.$1.length)
		);
	for (var k in o)
		if (new RegExp('(' + k + ')').test(fmt))
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
			);
	return fmt;
}
