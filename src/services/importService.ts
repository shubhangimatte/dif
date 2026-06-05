import api from '../api/api'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/Definitiv'

export interface DbInstance {
  id: number
  name: string
}

export interface ImportResponse {
  message?: string
}

export const importService = {
  getInstances: async (): Promise<DbInstance[]> => {
    try { return await api.get('/Importdboutputreport/getInstances') }
    catch { return [{ id: 1, name: 'Oracle' }, { id: 2, name: 'SQL Server' }, { id: 3, name: 'PostgreSQL' }, { id: 4, name: 'MySQL' }] }
  },

  importFile: (formData: FormData, onProgress?: (pct: number) => void): Promise<ImportResponse> =>
    axios.post(`${BASE_URL}/Importdboutputreport/import`, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        if (e.total) onProgress?.(Math.round(e.loaded * 100 / e.total))
      }
    }).then(r => r.data),

  deleteAll: () => api.get('/Importdboutputreport/Delete_All')
}
