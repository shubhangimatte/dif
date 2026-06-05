import api from '../api/api'

export interface DbInstance {
  id: number
  name: string
}

export interface RealtimeFormData {
  sourceinstance: string
  hostname: string
  port: string
  username: string
  password: string
  dbname: string
  schemaname: string
  destinstnce: string
}

export const realtimeService = {
  getInstances: async (): Promise<DbInstance[]> => {
    try { return await api.get('/RealtimeExtraction/getInstances') }
    catch { return [{ id: 1, name: 'Oracle' }, { id: 2, name: 'SQL Server' }, { id: 3, name: 'PostgreSQL' }, { id: 4, name: 'MySQL' }] }
  },

  testConnection: (data: RealtimeFormData) =>
    api.post('/RealtimeExtraction/extraction', { ...data, action: 'testconn' }),

  scanDatabase: (data: RealtimeFormData) =>
    api.post('/RealtimeExtraction/extraction', { ...data, action: 'scan' })
}
