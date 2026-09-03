import API from './api'

export const getBudget = () => API.get('api/budget')
export const setBudget = (data) => API.post('api/budget', data)
export const updateBudget = (data) => API.put('api/budget', data)
