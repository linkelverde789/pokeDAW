import axios from 'axios';

const axiosPoketeam = axios.create({
    baseURL: 'http://192.168.1.201:3000/poketeam/',
});

export default axiosPoketeam;
