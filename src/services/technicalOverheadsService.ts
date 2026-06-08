import api from '../api/api'

export interface OverheadSummary {
  unusedObjects: number
  unusedIndexes: number
  unusedTriggers: number
  deprecatedFeatures: number
  totalOverhead: number
}

export interface OverheadRow {
  Object_Type: string
  Object_Name: string
  Issue: string
  Last_Used: string
  Severity: string
  Recommendation: string
  [key: string]: unknown
}

export const technicalOverheadsService = {
  getSummary: async (): Promise<OverheadSummary> => {
    try { return await api.get('/TechnicalOverheads/getSummary') }
    catch {
      return { unusedObjects: 42, unusedIndexes: 18, unusedTriggers: 7, deprecatedFeatures: 12, totalOverhead: 79 }
    }
  },

  getRows: async (): Promise<OverheadRow[]> => {
    try { return await api.get('/TechnicalOverheads/getRows') }
    catch {
      return [
        { Object_Type: 'Index',    Object_Name: 'IDX_ORDERS_OLD',         Issue: 'Unused Index',             Last_Used: '2023-01-15', Severity: 'High',   Recommendation: 'Drop index — no query uses it' },
        { Object_Type: 'Index',    Object_Name: 'IDX_CUSTOMERS_PHONE',    Issue: 'Redundant Index',          Last_Used: '2023-03-22', Severity: 'High',   Recommendation: 'Consolidate with IDX_CUSTOMERS_MAIN' },
        { Object_Type: 'Index',    Object_Name: 'IDX_PRODUCTS_DESC',      Issue: 'Unused Index',             Last_Used: '2022-11-10', Severity: 'High',   Recommendation: 'Drop index' },
        { Object_Type: 'Trigger',  Object_Name: 'TRG_AUDIT_DEPRECATED',   Issue: 'Deprecated Trigger',       Last_Used: '2022-08-20', Severity: 'High',   Recommendation: 'Replace with audit table pattern' },
        { Object_Type: 'Trigger',  Object_Name: 'TRG_ORDERS_OLD_SYNC',    Issue: 'Unused Trigger',           Last_Used: '2021-12-05', Severity: 'High',   Recommendation: 'Drop trigger' },
        { Object_Type: 'View',     Object_Name: 'V_LEGACY_REPORT',        Issue: 'Unused View',              Last_Used: '2022-05-14', Severity: 'Medium', Recommendation: 'Archive or drop' },
        { Object_Type: 'View',     Object_Name: 'V_OLD_CUSTOMER_SUMMARY', Issue: 'Superseded by new view',   Last_Used: '2023-02-28', Severity: 'Medium', Recommendation: 'Replace with V_CUSTOMER_DASHBOARD' },
        { Object_Type: 'Procedure',Object_Name: 'SP_LEGACY_IMPORT',       Issue: 'Deprecated Procedure',     Last_Used: '2022-06-01', Severity: 'Medium', Recommendation: 'Migrate to SP_DATA_IMPORT_V2' },
        { Object_Type: 'Function', Object_Name: 'FN_OLD_CALC_TAX',        Issue: 'Unused Function',          Last_Used: '2022-09-17', Severity: 'Medium', Recommendation: 'Drop — replaced by FN_CALC_TAX_V2' },
        { Object_Type: 'Index',    Object_Name: 'IDX_LOG_TIMESTAMP',      Issue: 'Over-indexed column',      Last_Used: '2024-01-02', Severity: 'Low',    Recommendation: 'Review query plan and consider removal' },
        { Object_Type: 'Trigger',  Object_Name: 'TRG_EMAIL_QUEUE_LOG',    Issue: 'Performance overhead',     Last_Used: '2024-02-14', Severity: 'Low',    Recommendation: 'Evaluate async logging alternative' },
        { Object_Type: 'Function', Object_Name: 'FN_FORMAT_PHONE_LEGACY', Issue: 'Deprecated Function',      Last_Used: '2023-04-10', Severity: 'Low',    Recommendation: 'Replace with FN_FORMAT_PHONE' },
      ]
    }
  },
}
