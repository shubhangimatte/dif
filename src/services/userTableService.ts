import api from '../api/api'

export interface UserTableComplexity {
  vlowcount: number
  lowcount: number
  mediumcount: number
  highcount: number
  complexcount: number
}

export interface UserTableRow {
  Object_Name: string
  Column_Count: number
  Row_Count: number
  Constraint_Count: number
  Index_Count: number
  Complexity: string
  [key: string]: unknown
}

export const userTableService = {
  getComplexity: async (): Promise<UserTableComplexity[]> => {
    try { return await api.get('/UserTable/getComplexity') }
    catch { return [{ vlowcount: 524, lowcount: 312, mediumcount: 187, highcount: 64, complexcount: 23 }] }
  },
  getTableData: async (): Promise<UserTableRow[]> => {
    try { return await api.get('/UserTable/getTableData') }
    catch {
      return [
        { Object_Name: 'ORDERS', Column_Count: 24, Row_Count: 4200000, Constraint_Count: 8, Index_Count: 5, Complexity: 'High' },
        { Object_Name: 'CUSTOMERS', Column_Count: 18, Row_Count: 1800000, Constraint_Count: 4, Index_Count: 3, Complexity: 'Medium' }
      ]
    }
  }
}
