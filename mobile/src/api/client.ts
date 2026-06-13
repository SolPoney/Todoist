import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// L'IP de ton PC — le téléphone Android ne peut pas utiliser "localhost"
const BASE_URL = 'http://192.168.1.34:3000';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur : ajoute automatiquement le token JWT à chaque requête
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
