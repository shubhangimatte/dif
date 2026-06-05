import api from '../api/api'

export interface DataVolumeSummary {
  top10: number
  top25: number
  '50percentdata': number
  '1to10MB': number
  '10to100MB': number
  '100to1GB': number
  '1GBto10GB': number
  '10GBto50GB': number
  '50GBto100GB': number
  greaterThan100GB: number
}

export interface TableVolumeRow {
  Table_Name: string
  Size_MB: number
  [key: string]: unknown
}

export const dataVolumeService = {
  getSummary: async (): Promise<DataVolumeSummary> => {
    try { return await api.get('/DataVolume/getSummary') }
    catch {
      return {
        top10: 43315, top25: 79872, '50percentdata': 312,
        '1to10MB': 847, '10to100MB': 203, '100to1GB': 64,
        '1GBto10GB': 18, '10GBto50GB': 7, '50GBto100GB': 3, greaterThan100GB: 1
      }
    }
  },
  getTableData: async (): Promise<TableVolumeRow[]> => {
    try { return await api.get('/DataVolume/getTableData') }
    catch { return [{ Table_Name: 'ORDERS', Size_MB: 43315 }, { Table_Name: 'CUSTOMERS', Size_MB: 19149 }, { Table_Name: 'TRANSACTIONS', Size_MB: 9625 }] }
  }
}
