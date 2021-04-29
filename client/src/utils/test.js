unix = (d) => new Date(d).getTime().toString();
utc = (d) => new Date(d).toUTCString();

let test = '1451001600000';
console.log(Number(test));
console.log(utc(Number(test)));
console.log(unix(test));

console.log(Number(''));
console.log(utc(0));
