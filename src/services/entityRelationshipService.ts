import api from '../api/api'

export interface ERSummary {
  totalFK: number
  tablesWithFK: number
  referencedTables: number
  orphanTables: number
}

export interface ERRow {
  Constraint_Name: string
  Source_Table: string
  Source_Column: string
  Referenced_Table: string
  Referenced_Column: string
  [key: string]: unknown
}

export const entityRelationshipService = {
  getSummary: async (): Promise<ERSummary> => {
    try { return await api.get('/EntityRelationship/getSummary') }
    catch { return { totalFK: 284, tablesWithFK: 198, referencedTables: 142, orphanTables: 34 } }
  },
  getTableData: async (): Promise<ERRow[]> => {
    try { return await api.get('/EntityRelationship/getTableData') }
    catch {
      return [
        { Constraint_Name: 'FK_ORD_CUST',   Source_Table: 'ORDERS',       Source_Column: 'CUSTOMER_ID',  Referenced_Table: 'CUSTOMERS',   Referenced_Column: 'CUSTOMER_ID'  },
        { Constraint_Name: 'FK_ORD_PROD',   Source_Table: 'ORDER_ITEMS',  Source_Column: 'PRODUCT_ID',   Referenced_Table: 'PRODUCTS',    Referenced_Column: 'PRODUCT_ID'   },
        { Constraint_Name: 'FK_TXN_ACCT',   Source_Table: 'TRANSACTIONS', Source_Column: 'ACCOUNT_ID',   Referenced_Table: 'ACCOUNTS',    Referenced_Column: 'ACCOUNT_ID'   },
        { Constraint_Name: 'FK_EMP_DEPT',   Source_Table: 'EMPLOYEES',    Source_Column: 'DEPT_ID',      Referenced_Table: 'DEPARTMENTS', Referenced_Column: 'DEPT_ID'      },
        { Constraint_Name: 'FK_EMP_MGR',    Source_Table: 'EMPLOYEES',    Source_Column: 'MANAGER_ID',   Referenced_Table: 'EMPLOYEES',   Referenced_Column: 'EMPLOYEE_ID'  },
        { Constraint_Name: 'FK_ADDR_CUST',  Source_Table: 'ADDRESSES',    Source_Column: 'CUSTOMER_ID',  Referenced_Table: 'CUSTOMERS',   Referenced_Column: 'CUSTOMER_ID'  },
        { Constraint_Name: 'FK_INVL_ORDER', Source_Table: 'INVOICE_LINES',Source_Column: 'ORDER_ID',     Referenced_Table: 'ORDERS',      Referenced_Column: 'ORDER_ID'     },
      ]
    }
  }
}
