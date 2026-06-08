import api from '../api/api'

export interface FunctionComplexity {
  vlowcount: number
  lowcount: number
  mediumcount: number
  highcount: number
  complexcount: number
}

export interface FunctionRow {
  Function_Name: string
  Return_Type: string
  Line_Count: number
  Parameter_Count: number
  Complexity: string
  [key: string]: unknown
}

export const functionService = {
  getComplexity: async (): Promise<FunctionComplexity[]> => {
    try { return await api.get('/Functions/getComplexity') }
    catch { return [{ vlowcount: 12, lowcount: 15, mediumcount: 9, highcount: 4, complexcount: 1 }] }
  },
  getTableData: async (): Promise<FunctionRow[]> => {
    try { return await api.get('/Functions/getTableData') }
    catch {
      return [
        { Function_Name: 'FN_GET_BALANCE',   Return_Type: 'NUMBER',   Line_Count: 48,  Parameter_Count: 2, Complexity: 'Low'      },
        { Function_Name: 'FN_CALC_TAX',      Return_Type: 'NUMBER',   Line_Count: 92,  Parameter_Count: 4, Complexity: 'Medium'   },
        { Function_Name: 'FN_FORMAT_DATE',   Return_Type: 'VARCHAR2', Line_Count: 24,  Parameter_Count: 2, Complexity: 'Very Low' },
        { Function_Name: 'FN_VALIDATE_ACCT', Return_Type: 'BOOLEAN',  Line_Count: 136, Parameter_Count: 3, Complexity: 'High'     },
        { Function_Name: 'FN_ENCRYPT_DATA',  Return_Type: 'RAW',      Line_Count: 187, Parameter_Count: 2, Complexity: 'Complex'  },
        { Function_Name: 'FN_PARSE_JSON',    Return_Type: 'CLOB',     Line_Count: 64,  Parameter_Count: 1, Complexity: 'Low'      },
      ]
    }
  }
}
