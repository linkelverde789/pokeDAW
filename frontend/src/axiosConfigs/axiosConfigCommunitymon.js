import axios from 'axios';

const axiosInstanceCommunitymon = axios.create({
  baseURL: 'http://192.168.1.201:3000/communitymon/',
});

export default axiosInstanceCommunitymon;
