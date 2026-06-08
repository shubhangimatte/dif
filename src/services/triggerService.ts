import api from '../api/api'

export interface TriggerSummary {
  totalCount: number
  insertCount: number
  updateCount: number
  deleteCount: number
}

export interface TriggerRow {
  Trigger_Name: string
  Table_Name: string
  Event: string
  Timing: string
  Complexity: string
  [key: string]: unknown
}

export const triggerService = {
  getSummary: async (): Promise<TriggerSummary> => {
    try { return await api.get('/Triggers/getSummary') }
    catch { return { totalCount: 18, insertCount: 7, updateCount: 8, deleteCount: 3 } }
  },
  getTableData: async (): Promise<TriggerRow[]> => {
    try { return await api.get('/Triggers/getTableData') }
    catch {
      return [
        { Trigger_Name: 'TRG_ORDERS_AUD',    Table_Name: 'ORDERS',       Event: 'INSERT, UPDATE', Timing: 'AFTER',  Complexity: 'Low'      },
        { Trigger_Name: 'TRG_CUSTOMER_UPD',  Table_Name: 'CUSTOMERS',    Event: 'UPDATE',         Timing: 'BEFORE', Complexity: 'Very Low' },
        { Trigger_Name: 'TRG_TXN_INS',       Table_Name: 'TRANSACTIONS', Event: 'INSERT',         Timing: 'AFTER',  Complexity: 'Medium'   },
        { Trigger_Name: 'TRG_PRODUCT_DEL',   Table_Name: 'PRODUCTS',     Event: 'DELETE',         Timing: 'BEFORE', Complexity: 'Low'      },
        { Trigger_Name: 'TRG_EMP_SALARY',    Table_Name: 'EMPLOYEES',    Event: 'UPDATE',         Timing: 'BEFORE', Complexity: 'Medium'   },
        { Trigger_Name: 'TRG_AUDIT_ALL',     Table_Name: 'AUDIT_LOG',    Event: 'INSERT',         Timing: 'AFTER',  Complexity: 'Very Low' },
      ]
    }
  }
}
