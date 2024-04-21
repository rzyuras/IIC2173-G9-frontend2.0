// API calls related to user authentication
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';  //REEMPLAZAR

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/login`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL}/users/register`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}
