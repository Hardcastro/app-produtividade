import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '@/router'

// A API para este exemplo estará rodando em http://localhost:8000
// Este valor pode ser colocado em um arquivo .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('authToken'));
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);

  // Actions
  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('authToken', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  }

  function clearToken() {
    token.value = null;
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  }

  async function login(email: string, password: string): Promise<void> {
    error.value = null;
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await axios.post(`${API_URL}/auth/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const accessToken = response.data.access_token;
      if (accessToken) {
        setToken(accessToken);
        await router.push({ name: 'dashboard' });
      } else {
        throw new Error('Token de acesso não encontrado na resposta');
      }
    } catch (err: any) {
      clearToken();
      if (err.response && err.response.status === 401) {
        error.value = 'Email ou senha inválidos.';
      } else {
        error.value = 'Ocorreu um erro ao tentar fazer login. Tente novamente.';
      }
      console.error('Falha no login:', err);
      throw err;
    }
  }

  async function logout() {
    clearToken();
    await router.push({ name: 'login' });
  }
  
  // Initialize axios header if token exists on load
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  return { token, error, isAuthenticated, login, logout };
});
