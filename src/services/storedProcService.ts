import api from '../api/api'

export interface StoredProcComplexity {
  vlowcount: number
  lowcount: number
  mediumcount: number
  highcount: number
  complexcount: number
}

export interface StoredProcRow {
  Sp_Name: string
  Line_Of_Code: number
  Complexity: string
  [key: string]: unknown
}

export interface SPObject {
  Object_Name: string
  Object_Type: string
  Complexity: string
  Row_Count: number
  [key: string]: unknown
}

export const storedProcService = {
  getComplexity: async (): Promise<StoredProcComplexity[]> => {
    try { return await api.get('/StoredProc/getComplexity') }
    catch { return [{ vlowcount: 28, lowcount: 31, mediumcount: 22, highcount: 10, complexcount: 2 }] }
  },

  getTableData: async (): Promise<StoredProcRow[]> => {
    try { return await api.get('/StoredProc/getTableData') }
    catch {
      return [
        { Sp_Name: 'SP_ORDER_PROCESS',   Line_Of_Code: 284, Complexity: 'High'     },
        { Sp_Name: 'SP_CUSTOMER_SYNC',   Line_Of_Code: 142, Complexity: 'Medium'   },
        { Sp_Name: 'SP_REPORT_GEN',      Line_Of_Code: 412, Complexity: 'Complex'  },
        { Sp_Name: 'SP_DATA_ARCHIVE',    Line_Of_Code: 98,  Complexity: 'Low'      },
        { Sp_Name: 'SP_AUDIT_LOG',       Line_Of_Code: 54,  Complexity: 'Very Low' },
        { Sp_Name: 'SP_BATCH_UPDATE',    Line_Of_Code: 326, Complexity: 'High'     },
        { Sp_Name: 'SP_NOTIFY_USER',     Line_Of_Code: 76,  Complexity: 'Low'      },
        { Sp_Name: 'SP_INVENTORY_SYNC',  Line_Of_Code: 198, Complexity: 'Medium'   },
        { Sp_Name: 'SP_PAYMENT_PROC',    Line_Of_Code: 445, Complexity: 'Complex'  },
        { Sp_Name: 'SP_EMAIL_NOTIFY',    Line_Of_Code: 42,  Complexity: 'Very Low' },
      ]
    }
  },

  getSPObjects: async (spName: string): Promise<SPObject[]> => {
    try { return await api.get('/StoredProc/getDependency', { params: { spname: spName } }) }
    catch {
      const mockMap: Record<string, SPObject[]> = {
        SP_ORDER_PROCESS: [
          { Object_Name: 'ORDERS',           Object_Type: 'TABLE', Complexity: 'High',     Row_Count: 4200000 },
          { Object_Name: 'ORDER_ITEMS',       Object_Type: 'TABLE', Complexity: 'Medium',   Row_Count: 9800000 },
          { Object_Name: 'V_ORDER_SUMMARY',   Object_Type: 'VIEW',  Complexity: 'Low',      Row_Count: 0       },
        ],
        SP_CUSTOMER_SYNC: [
          { Object_Name: 'CUSTOMERS',         Object_Type: 'TABLE', Complexity: 'Medium',   Row_Count: 1800000 },
          { Object_Name: 'ADDRESSES',         Object_Type: 'TABLE', Complexity: 'Very Low', Row_Count: 2400000 },
        ],
        SP_REPORT_GEN: [
          { Object_Name: 'ORDERS',            Object_Type: 'TABLE', Complexity: 'High',     Row_Count: 4200000 },
          { Object_Name: 'CUSTOMERS',         Object_Type: 'TABLE', Complexity: 'Medium',   Row_Count: 1800000 },
          { Object_Name: 'PRODUCTS',          Object_Type: 'TABLE', Complexity: 'Low',      Row_Count: 42000   },
          { Object_Name: 'V_SALES_REPORT',    Object_Type: 'VIEW',  Complexity: 'High',     Row_Count: 0       },
        ],
        SP_BATCH_UPDATE: [
          { Object_Name: 'PRODUCTS',          Object_Type: 'TABLE', Complexity: 'Medium',   Row_Count: 42000   },
          { Object_Name: 'INVENTORY',         Object_Type: 'TABLE', Complexity: 'High',     Row_Count: 88000   },
        ],
        SP_PAYMENT_PROC: [
          { Object_Name: 'PAYMENTS',          Object_Type: 'TABLE', Complexity: 'Complex',  Row_Count: 7200000 },
          { Object_Name: 'ORDERS',            Object_Type: 'TABLE', Complexity: 'High',     Row_Count: 4200000 },
          { Object_Name: 'V_PAYMENT_SUMMARY', Object_Type: 'VIEW',  Complexity: 'Medium',   Row_Count: 0       },
        ],
        SP_INVENTORY_SYNC: [
          { Object_Name: 'INVENTORY',         Object_Type: 'TABLE', Complexity: 'High',     Row_Count: 88000   },
          { Object_Name: 'PRODUCTS',          Object_Type: 'TABLE', Complexity: 'Low',      Row_Count: 42000   },
          { Object_Name: 'WAREHOUSES',        Object_Type: 'TABLE', Complexity: 'Very Low', Row_Count: 120     },
        ],
      }
      return mockMap[spName] ?? [
        { Object_Name: 'ORDERS',    Object_Type: 'TABLE', Complexity: 'Medium',   Row_Count: 4200000 },
        { Object_Name: 'CUSTOMERS', Object_Type: 'TABLE', Complexity: 'Very Low', Row_Count: 1800000 },
      ]
    }
  },

  getAllDependencies: async (): Promise<Array<{ Sp_Name: string; object_name: string; object_type: string }>> => {
    try { return await api.get('/StoredProc/printAllData_Dependencies') }
    catch { return [] }
  },
}
