import api from '../api/api'

export interface DatabaseSummary {
  dbCount: number
  tablesCount: number
  fieldCount: number
  datatypeCount: number
  storedproCount: number
  funCount: number
  rowSum: number
  dbSum: number
}

export interface DatabaseComplexity {
  vlowcount: number
  lowcount: number
  mediumcount: number
  highcount: number
  complexcount: number
}

export interface DbDetail {
  complex_datatype?: number
  tbl_lowcomplexity?: number
  tbl_mediumcomplexity?: number
  tbl_highcomplexity?: number
  dashboardtop10?: string
}

export interface Database {
  id: number
  name: string
  complexity: string
  tables: number
  viewcount: number
  functions: string
  storedprocedure: string
  dbsize: string
  dbsummary: DbDetail
}

export const dashboardService = {
  updateDatabase: (projectId: string | number, env: string) =>
    api.post('/Dashboard/updateDatabase/', { project_id: projectId, env }),

  getEnvOptions: (projectId: string | number) =>
    api.post('/Dashboard/getEnvidOptions/', { project_id: projectId }),

  getSummary: async (): Promise<DatabaseSummary> => ({
    dbCount: 12, tablesCount: 2418, fieldCount: 18743,
    datatypeCount: 94, storedproCount: 312, funCount: 87,
    rowSum: 4200000, dbSum: 141312
  }),

  getComplexity: async (): Promise<DatabaseComplexity> => ({
    vlowcount: 24, lowcount: 58, mediumcount: 72, highcount: 41, complexcount: 17
  }),

  getDatabases: async (): Promise<Database[]> => ([
    {
      id: 1, name: 'PROD_ORACLE_MAIN', complexity: 'Medium',
      tables: 347, viewcount: 82, functions: '41 (12K)',
      storedprocedure: '93 (38K)', dbsize: '42.3 GB',
      dbsummary: { complex_datatype: 14, tbl_lowcomplexity: 128, tbl_mediumcomplexity: 93, tbl_highcomplexity: 17, dashboardtop10: '31.4 GB' }
    },
    { id: 2, name: 'DEV_SQLSERVER_HR', complexity: 'Low', tables: 124, viewcount: 18, functions: '12 (3K)', storedprocedure: '24 (8K)', dbsize: '8.1 GB', dbsummary: {} },
    { id: 3, name: 'UAT_POSTGRES_FINANCE', complexity: 'High', tables: 289, viewcount: 44, functions: '38 (15K)', storedprocedure: '71 (22K)', dbsize: '31.2 GB', dbsummary: {} }
  ]),

  getMigrationProjects: async (): Promise<unknown[]> => ([])
}
