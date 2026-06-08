import api from '../api/api'

export interface IndexSummary {
  totalCount: number
  uniqueCount: number
  clusteredCount: number
  nonClusteredCount: number
  compositeCount: number
}

export interface IndexRow {
  Index_Name: string
  Table_Name: string
  Columns: string
  Index_Type: string
  Is_Unique: string
  [key: string]: unknown
}

export const indexService = {
  getSummary: async (): Promise<IndexSummary> => {
    try { return await api.get('/Indexes/getSummary') }
    catch { return { totalCount: 524, uniqueCount: 187, clusteredCount: 142, nonClusteredCount: 382, compositeCount: 93 } }
  },
  getTableData: async (): Promise<IndexRow[]> => {
    try { return await api.get('/Indexes/getTableData') }
    catch {
      return [
        { Index_Name: 'PK_ORDERS',       Table_Name: 'ORDERS',       Columns: 'ORDER_ID',                 Index_Type: 'Clustered',     Is_Unique: 'Yes' },
        { Index_Name: 'IDX_ORD_CUST',    Table_Name: 'ORDERS',       Columns: 'CUSTOMER_ID, ORDER_DATE',  Index_Type: 'Non-Clustered', Is_Unique: 'No'  },
        { Index_Name: 'PK_CUSTOMERS',    Table_Name: 'CUSTOMERS',    Columns: 'CUSTOMER_ID',              Index_Type: 'Clustered',     Is_Unique: 'Yes' },
        { Index_Name: 'UQ_CUST_EMAIL',   Table_Name: 'CUSTOMERS',    Columns: 'EMAIL',                    Index_Type: 'Non-Clustered', Is_Unique: 'Yes' },
        { Index_Name: 'IDX_TXN_DATE',    Table_Name: 'TRANSACTIONS', Columns: 'TXN_DATE',                 Index_Type: 'Non-Clustered', Is_Unique: 'No'  },
        { Index_Name: 'IDX_PROD_CAT',    Table_Name: 'PRODUCTS',     Columns: 'CATEGORY_ID, STATUS',      Index_Type: 'Non-Clustered', Is_Unique: 'No'  },
        { Index_Name: 'PK_EMPLOYEES',    Table_Name: 'EMPLOYEES',    Columns: 'EMPLOYEE_ID',              Index_Type: 'Clustered',     Is_Unique: 'Yes' },
        { Index_Name: 'IDX_EMP_DEPT',    Table_Name: 'EMPLOYEES',    Columns: 'DEPT_ID',                  Index_Type: 'Non-Clustered', Is_Unique: 'No'  },
      ]
    }
  }
}
