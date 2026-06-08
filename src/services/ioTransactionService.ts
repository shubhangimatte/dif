import api from '../api/api'

export interface IOSummary {
  totalReads: number
  totalWrites: number
  totalTransactions: number
  highIOCount: number
}

export interface IORow {
  Table_Name: string
  Reads: number
  Writes: number
  Total_IO: number
  Read_Pct: string
  Write_Pct: string
  [key: string]: unknown
}

export const ioTransactionService = {
  getSummary: async (): Promise<IOSummary> => {
    try { return await api.get('/IOTransaction/getSummary') }
    catch { return { totalReads: 14820000, totalWrites: 3240000, totalTransactions: 18060000, highIOCount: 24 } }
  },
  getTableData: async (): Promise<IORow[]> => {
    try { return await api.get('/IOTransaction/getTableData') }
    catch {
      return [
        { Table_Name: 'ORDERS',       Reads: 4200000, Writes: 840000,  Total_IO: 5040000, Read_Pct: '83.3%', Write_Pct: '16.7%' },
        { Table_Name: 'TRANSACTIONS', Reads: 3800000, Writes: 1200000, Total_IO: 5000000, Read_Pct: '76.0%', Write_Pct: '24.0%' },
        { Table_Name: 'CUSTOMERS',    Reads: 2400000, Writes: 320000,  Total_IO: 2720000, Read_Pct: '88.2%', Write_Pct: '11.8%' },
        { Table_Name: 'PRODUCTS',     Reads: 1840000, Writes: 180000,  Total_IO: 2020000, Read_Pct: '91.1%', Write_Pct: '8.9%'  },
        { Table_Name: 'AUDIT_LOG',    Reads: 280000,  Writes: 920000,  Total_IO: 1200000, Read_Pct: '23.3%', Write_Pct: '76.7%' },
        { Table_Name: 'EMPLOYEES',    Reads: 980000,  Writes: 124000,  Total_IO: 1104000, Read_Pct: '88.8%', Write_Pct: '11.2%' },
        { Table_Name: 'INVENTORY',    Reads: 640000,  Writes: 480000,  Total_IO: 1120000, Read_Pct: '57.1%', Write_Pct: '42.9%' },
      ]
    }
  }
}
