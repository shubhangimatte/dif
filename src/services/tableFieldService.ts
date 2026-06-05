import api from '../api/api'

export interface TableRow {
  Table_Name: string
}

export interface TableField {
  sr?: number
  Column_Name: string
  Datatype: string
  Max_Length: string | number
  Constraint: string
  Is_Nullable: string
  [key: string]: unknown
}

const MOCK_TABLES: TableRow[] = [
  { Table_Name: 'ORDERS' }, { Table_Name: 'CUSTOMERS' },
  { Table_Name: 'TRANSACTIONS' }, { Table_Name: 'PRODUCTS' }
]

export const tableFieldService = {
  getTables: async (): Promise<TableRow[]> => {
    try { return await api.get('/TableFieldListing/getTables') }
    catch { return MOCK_TABLES }
  },

  getTableFields: (tableName: string): Promise<TableField[]> =>
    api.post('/TableFieldListing/getTableData', { Table_Name: tableName }),

  printAllData: (): Promise<TableField[]> =>
    api.get('/TableFieldListing/printAllData')
}
