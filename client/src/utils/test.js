async function foo() {
	try {
		const test = await Promise.reject(2);
		// 下面这行不会执行
		console.log('hi');
	} catch (err) {
		console.log(err);
	}
}
foo();
