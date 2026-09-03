import API from './api'

export const getMonthlyReport = (params) => API.get('api/reports/monthly', { params })
export const downloadMonthlyReport = (params) => API.get('api/reports/monthly', {
  params: { ...params, format: 'pdf' },
  responseType: 'blob'
})
