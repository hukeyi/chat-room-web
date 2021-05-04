import axios from 'axios';

const Register = (data) => axios.post('/api/user/register', data);
const Login = (data) => axios.post(`/api/user/login`, data);
const Logout = () => axios.get('/api/user/logout');

export default {
	Register,
	Login,
	Logout,
};
