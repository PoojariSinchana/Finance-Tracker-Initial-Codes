import API from './api'

export const generateInsights = () => API.post('api/ai/insights')
export const predictSpending = () => API.post('api/ai/predict')
