import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
