import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api' // La URL de tu Spring Boot
});

export default API;