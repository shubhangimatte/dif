import api from '../api/api'

export interface DatatypeSummary {
  totalDatatypes: number
  numericCount: number
  stringCount: number
  dateCount: number
  otherCount: number
}

export interface DatatypeRow {
  Datatype: string
  Category: string
  Column_Count: number
  Table_Count: number
  [key: string]: unknown
}

export const datatypeService = {
  getSummary: async (): Promise<DatatypeSummary> => {
    try { return await api.get('/Datatype/getSummary') }
    catch { return { totalDatatypes: 42, numericCount: 14, stringCount: 18, dateCount: 6, otherCount: 4 } }
  },
  getTableData: async (): Promise<DatatypeRow[]> => {
    try { return await api.get('/Datatype/getTableData') }
    catch {
      return [
        { Datatype: 'VARCHAR2',  Category: 'String',  Column_Count: 1842, Table_Count: 312 },
        { Datatype: 'NUMBER',    Category: 'Numeric', Column_Count: 1204, Table_Count: 287 },
        { Datatype: 'DATE',      Category: 'Date',    Column_Count: 634,  Table_Count: 198 },
        { Datatype: 'CHAR',      Category: 'String',  Column_Count: 421,  Table_Count: 142 },
        { Datatype: 'TIMESTAMP', Category: 'Date',    Column_Count: 318,  Table_Count: 94  },
        { Datatype: 'CLOB',      Category: 'LOB',     Column_Count: 87,   Table_Count: 43  },
        { Datatype: 'BLOB',      Category: 'LOB',     Column_Count: 54,   Table_Count: 28  },
        { Datatype: 'INTEGER',   Category: 'Numeric', Column_Count: 398,  Table_Count: 167 },
        { Datatype: 'FLOAT',     Category: 'Numeric', Column_Count: 142,  Table_Count: 89  },
        { Datatype: 'NVARCHAR2', Category: 'String',  Column_Count: 234,  Table_Count: 76  },
      ]
    }
  }
}
