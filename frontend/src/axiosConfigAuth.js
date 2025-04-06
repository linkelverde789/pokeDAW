import axios from 'axios';

const axiosInstanceAuth = axios.create({
  baseURL: 'http://192.168.1.201:3000/auth/',
});

export default axiosInstanceAuth;
