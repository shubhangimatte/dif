import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/Definitiv'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

api.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err)
)

export default api
