import api from '../api/api'

export interface AccessClient { id: number; client_name: string }

export const userAccessService = {
  getClients: async (): Promise<AccessClient[]> => {
    try { return await api.get('/UserAccess/getClients') }
    catch {
      return [
        { id: 1, client_name: 'Acme Corporation'    },
        { id: 2, client_name: 'Global Finance Ltd'  },
        { id: 3, client_name: 'TechNova Inc'        },
        { id: 4, client_name: 'Meridian Healthcare' },
      ]
    }
  },

  getAccess: async (clientId: number): Promise<string[]> => {
    try { return await api.get('/UserAccess/getAccess', { params: { id: clientId } }) }
    catch {
      const map: Record<number, string[]> = {
        1: ['Importdboutput', 'RealtimeExtraction', 'DataVolume', 'UserTable', 'TableFieldListing', 'StoredProcedures', 'Summary'],
        2: ['Importdboutput', 'DataVolume', 'Views', 'Functions', 'Summary', 'DetailedEstimations'],
        3: ['DataVolume', 'UserTable', 'Datatype', 'Indexes'],
        4: ['Importdboutput', 'DataVolume', 'UserTable', 'TableFieldListing', 'Views', 'StoredProcedures', 'Functions', 'Indexes', 'Triggers', 'Summary'],
      }
      return map[clientId] ?? []
    }
  },

  saveAccess: async (clientId: number, pages: string[]): Promise<void> => {
    try { await api.post('/UserAccess/User_access', { access_menu: clientId, pages }) }
    catch { /* mock */ }
  },
}
