import api from '../api/api'

export interface Client {
  id: number
  client_name: string
  client_opportunity: string
  account_poc: string
  is_active: boolean
}

export interface ClientCredentials {
  client_poc: string
  primary_username: string
  primary_password: string
  secondary_username: string
  secondary_password: string
}

export interface ClientProject {
  client_name: string
  project_name: string
  project_description: string
}

export const clientService = {
  getClients: async (): Promise<Client[]> => {
    try { return await api.get('/Client/getClients') }
    catch {
      return [
        { id: 1, client_name: 'Acme Corporation',    client_opportunity: 'OPP-2024-001', account_poc: 'John Smith',    is_active: true  },
        { id: 2, client_name: 'Global Finance Ltd',  client_opportunity: 'OPP-2024-002', account_poc: 'Sarah Johnson', is_active: true  },
        { id: 3, client_name: 'TechNova Inc',        client_opportunity: 'OPP-2024-003', account_poc: 'Mike Wilson',   is_active: false },
        { id: 4, client_name: 'Meridian Healthcare', client_opportunity: 'OPP-2024-004', account_poc: 'Lisa Patel',    is_active: true  },
      ]
    }
  },

  getCredentials: async (id: number): Promise<ClientCredentials> => {
    try { return await api.get('/Client/getCredentials', { params: { id } }) }
    catch {
      const map: Record<number, ClientCredentials> = {
        1: { client_poc: 'Alice Brown',  primary_username: 'acme_primary',     primary_password: '••••••••', secondary_username: 'acme_secondary',     secondary_password: '••••••••' },
        2: { client_poc: 'Bob Davis',    primary_username: 'gfl_primary',      primary_password: '••••••••', secondary_username: 'gfl_secondary',      secondary_password: '••••••••' },
        3: { client_poc: 'Carol Lee',    primary_username: 'tnova_primary',    primary_password: '••••••••', secondary_username: 'tnova_secondary',    secondary_password: '••••••••' },
        4: { client_poc: 'David Chen',   primary_username: 'meridian_primary', primary_password: '••••••••', secondary_username: 'meridian_secondary', secondary_password: '••••••••' },
      }
      return map[id] ?? { client_poc: 'N/A', primary_username: 'N/A', primary_password: 'N/A', secondary_username: 'N/A', secondary_password: 'N/A' }
    }
  },

  getProjects: async (id: number): Promise<ClientProject[]> => {
    try { return await api.get('/Client/get_project', { params: { id } }) }
    catch {
      const map: Record<number, ClientProject[]> = {
        1: [
          { client_name: 'Acme Corporation',    project_name: 'Oracle to PostgreSQL Migration', project_description: 'Full schema and data migration from Oracle 19c to PostgreSQL 15' },
          { client_name: 'Acme Corporation',    project_name: 'SQL Server Assessment',          project_description: 'Assessment of legacy SQL Server 2012 databases' },
        ],
        2: [{ client_name: 'Global Finance Ltd',  project_name: 'DB2 Migration Phase 1',        project_description: 'Assessment and migration planning for 12 DB2 databases' }],
        3: [{ client_name: 'TechNova Inc',        project_name: 'MySQL Consolidation',          project_description: 'Consolidating 40+ MySQL instances into a managed service' }],
        4: [{ client_name: 'Meridian Healthcare', project_name: 'SQL Server Modernisation',     project_description: 'Lift-and-shift SQL Server 2014 workloads to Azure SQL Managed Instance' }],
      }
      return map[id] ?? []
    }
  },

  getAllProjects: async (): Promise<ClientProject[]> => {
    try { return await api.get('/Client/getAllProjects') }
    catch {
      return [
        { client_name: 'Acme Corporation',    project_name: 'Oracle to PostgreSQL Migration',    project_description: 'Full schema and data migration from Oracle 19c to PostgreSQL 15' },
        { client_name: 'Acme Corporation',    project_name: 'SQL Server Assessment',             project_description: 'Assessment of legacy SQL Server 2012 databases' },
        { client_name: 'Global Finance Ltd',  project_name: 'DB2 Migration Phase 1',             project_description: 'Assessment and migration planning for 12 DB2 databases' },
        { client_name: 'TechNova Inc',        project_name: 'MySQL Consolidation',               project_description: 'Consolidating 40+ MySQL instances into a managed service' },
        { client_name: 'Meridian Healthcare', project_name: 'SQL Server Modernisation',          project_description: 'Lift-and-shift SQL Server 2014 workloads to Azure SQL Managed Instance' },
      ]
    }
  },

  changeStatus: async (clientId: number, status: 0 | 1): Promise<void> => {
    try { await api.post(`/Client/changestatus/${status}/${clientId}`, {}) }
    catch { /* mock */ }
  },
}
