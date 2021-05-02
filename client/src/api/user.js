import axios from 'axios';

const Register = (data) => axios.post('/api/user', data);
const Login = (id, password) =>
	axios.post(`/api/user/${id}`, { password: password });

export default {
	Register,
	Login,
};
