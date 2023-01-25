import axios from 'axios';

export const api = axios.create({
    baseURl: 'http://:3333'
});