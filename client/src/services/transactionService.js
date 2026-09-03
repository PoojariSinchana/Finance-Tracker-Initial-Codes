import API from './api'

export const getTransactions = (params) => API.get('api/transactions', { params })
export const createTransaction = (data) => API.post('api/transactions', data)
export const updateTransaction = (id, data) => API.put(`api/transactions/${id}`, data)
export const deleteTransaction = (id) => API.delete(`api/transactions/${id}`)
