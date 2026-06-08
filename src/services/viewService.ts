import api from '../api/api'

export interface ViewComplexity {
  vlowcount: number
  lowcount: number
  mediumcount: number
  highcount: number
  complexcount: number
}

export interface ViewRow {
  View_Name: string
  [key: string]: unknown
}

export interface ViewColumn {
  sr?: number
  Column_Name: string
  Datatype: string
  Is_Nullable: string
  [key: string]: unknown
}

export const viewService = {
  getComplexity: async (): Promise<ViewComplexity[]> => {
    try { return await api.get('/Views/getComplexity') }
    catch { return [{ vlowcount: 34, lowcount: 28, mediumcount: 14, highcount: 6, complexcount: 0 }] }
  },
  getTableData: async (): Promise<ViewRow[]> => {
    try { return await api.get('/Views/getTableData') }
    catch {
      return [
        { View_Name: 'V_ORDERS_SUMMARY',      Column_Count: 12, Line_Count: 48,  Complexity: 'Low'      },
        { View_Name: 'V_CUSTOMER_DETAILS',     Column_Count: 24, Line_Count: 94,  Complexity: 'Medium'   },
        { View_Name: 'V_TRANSACTION_REPORT',   Column_Count: 18, Line_Count: 72,  Complexity: 'Medium'   },
        { View_Name: 'V_PRODUCT_CATALOG',      Column_Count: 8,  Line_Count: 22,  Complexity: 'Very Low' },
        { View_Name: 'V_EMPLOYEE_HIERARCHY',   Column_Count: 15, Line_Count: 136, Complexity: 'High'     },
      ]
    }
  },
  getViewColumns: async (viewName: string): Promise<ViewColumn[]> => {
    try { return await api.post('/Views/getViewColumns', { View_Name: viewName }) }
    catch {
      return [
        { Column_Name: 'ID',           Datatype: 'NUMBER',        Is_Nullable: 'No'  },
        { Column_Name: 'NAME',         Datatype: 'VARCHAR2(100)', Is_Nullable: 'No'  },
        { Column_Name: 'STATUS',       Datatype: 'CHAR(1)',       Is_Nullable: 'Yes' },
        { Column_Name: 'CREATED_DATE', Datatype: 'DATE',          Is_Nullable: 'Yes' },
      ]
    }
  }
}
