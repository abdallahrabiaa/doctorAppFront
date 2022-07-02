import axios from 'axios';
import config from './config'
let progress = 0;
export function getProgress() {
    return progress
}
const instance = axios.create({
    baseURL: config.API_URL,
    headers: { authorization: getCurrentToken() },

})

function getCurrentToken() {
    try {
        const token = localStorage.getItem('token');
        return JSON.parse(token);
    }
    catch (err) {
        localStorage.removeItem('token')
        return null;
    }

}
export default instance;