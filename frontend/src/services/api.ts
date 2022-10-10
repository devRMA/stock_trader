import axios from 'axios';

export const apiUrl = process.env.API_URL;

export default axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
