import axios from 'axios';

export const apiUrl = 'http://localhost';

export default axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
