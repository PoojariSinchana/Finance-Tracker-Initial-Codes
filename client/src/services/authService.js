import API from './api'

export const signup = (data) => API.post('/api/auth/signup', data)
export const login = (data) => API.post('/api/auth/login', data)
export const getMe = () => API.get('/api/auth/me')
export const updateProfile = (data) => API.put('/api/auth/profile', data)
export const changePassword = (data) => API.put('/api/auth/password', data)
export const getAccountStats = () => API.get('/api/auth/stats')
