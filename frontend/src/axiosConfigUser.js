import axios from 'axios';

const axiosUserPokemon = axios.create({
  baseURL: 'http://192.168.1.201:3000/user/',
});

export default axiosUserPokemon;
