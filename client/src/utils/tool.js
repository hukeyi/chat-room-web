export function isObjectsEqual(a, b) {
	if (!a || !b) {
		return a === b;
	}
	let aProps = Object.getOwnPropertyNames(a);
	let bProps = Object.getOwnPropertyNames(b);
	if (aProps.length != bProps.length) {
		return false;
	}

	for (let i = 0; i < aProps.length; i++) {
		let propName = aProps[i];
		if (typeof a[propName] === 'object') {
			let judge = isObjectsEqual(a[propName], b[propName]);
			if (!judge) {
				return false;
			}
		} else if (a[propName] !== b[propName]) {
			return false;
		}
	}
	return true;
}
