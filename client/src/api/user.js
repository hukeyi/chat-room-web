import axios from 'axios';

const Register = (data) => axios.post('/api/user', data);
const Login = (data) =>
	axios.post(`/api/user/${data.phone}`, { password: data.password });

export default {
	Register,
	Login,
};
