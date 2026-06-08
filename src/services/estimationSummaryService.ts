import api from '../api/api'

export interface EstimationRow {
  Object_Type: string
  Migration_Pattern: string
  Automation_Pct: string
  Efforts_PD: number
}

export interface EstimationData {
  rows: EstimationRow[]
  total: number
}

export interface DetailedEstimationRow {
  Object_Name: string
  Object_Type: string
  Complexity: string
  Migration_Pattern: string
  Automation_Pct: string
  Efforts_PD: number
  Notes: string
  [key: string]: unknown
}

export const estimationSummaryService = {
  getData: async (): Promise<EstimationData> => {
    try { return await api.get('/EstimationSummary/getData') }
    catch {
      const rows: EstimationRow[] = [
        { Object_Type: 'Tables',           Migration_Pattern: 'Automated',           Automation_Pct: '90–100%', Efforts_PD: 4.20  },
        { Object_Type: 'Triggers',         Migration_Pattern: 'Automated',           Automation_Pct: '90–100%', Efforts_PD: 1.80  },
        { Object_Type: 'Views',            Migration_Pattern: 'Partially Automated', Automation_Pct: '50–70%',  Efforts_PD: 8.40  },
        { Object_Type: 'Stored Procedure', Migration_Pattern: 'Partially Automated', Automation_Pct: '25–50%',  Efforts_PD: 23.25 },
        { Object_Type: 'Functions',        Migration_Pattern: 'Partially Automated', Automation_Pct: '20–40%',  Efforts_PD: 10.25 },
      ]
      return { rows, total: rows.reduce((s, r) => s + r.Efforts_PD, 0) }
    }
  },

  getDetailedRows: async (): Promise<DetailedEstimationRow[]> => {
    try { return await api.get('/EstimationSummary/getDetailedRows') }
    catch {
      return [
        // Tables
        { Object_Name: 'ORDERS',             Object_Type: 'Table',    Complexity: 'High',     Migration_Pattern: 'Automated',           Automation_Pct: '95%', Efforts_PD: 0.50, Notes: 'Complex FK constraints — verify post-migration' },
        { Object_Name: 'ORDER_ITEMS',         Object_Type: 'Table',    Complexity: 'Medium',   Migration_Pattern: 'Automated',           Automation_Pct: '95%', Efforts_PD: 0.25, Notes: '' },
        { Object_Name: 'CUSTOMERS',           Object_Type: 'Table',    Complexity: 'Medium',   Migration_Pattern: 'Automated',           Automation_Pct: '95%', Efforts_PD: 0.25, Notes: '' },
        { Object_Name: 'PRODUCTS',            Object_Type: 'Table',    Complexity: 'Low',      Migration_Pattern: 'Automated',           Automation_Pct: '100%',Efforts_PD: 0.10, Notes: '' },
        { Object_Name: 'INVENTORY',           Object_Type: 'Table',    Complexity: 'Medium',   Migration_Pattern: 'Automated',           Automation_Pct: '95%', Efforts_PD: 0.25, Notes: '' },
        { Object_Name: 'PAYMENTS',            Object_Type: 'Table',    Complexity: 'High',     Migration_Pattern: 'Automated',           Automation_Pct: '90%', Efforts_PD: 0.50, Notes: 'Encrypted columns need special handling' },
        { Object_Name: 'ADDRESSES',           Object_Type: 'Table',    Complexity: 'Very Low', Migration_Pattern: 'Automated',           Automation_Pct: '100%',Efforts_PD: 0.10, Notes: '' },
        { Object_Name: 'WAREHOUSES',          Object_Type: 'Table',    Complexity: 'Very Low', Migration_Pattern: 'Automated',           Automation_Pct: '100%',Efforts_PD: 0.10, Notes: '' },
        { Object_Name: 'AUDIT_LOG',           Object_Type: 'Table',    Complexity: 'Low',      Migration_Pattern: 'Automated',           Automation_Pct: '100%',Efforts_PD: 0.10, Notes: '' },
        { Object_Name: 'CATEGORIES',          Object_Type: 'Table',    Complexity: 'Very Low', Migration_Pattern: 'Automated',           Automation_Pct: '100%',Efforts_PD: 0.05, Notes: '' },
        // Views
        { Object_Name: 'V_ORDER_SUMMARY',     Object_Type: 'View',     Complexity: 'Medium',   Migration_Pattern: 'Partially Automated', Automation_Pct: '60%', Efforts_PD: 0.75, Notes: 'CONNECT BY syntax needs rewrite' },
        { Object_Name: 'V_CUSTOMER_DASHBOARD',Object_Type: 'View',     Complexity: 'High',     Migration_Pattern: 'Partially Automated', Automation_Pct: '50%', Efforts_PD: 1.50, Notes: 'Oracle-specific analytic functions' },
        { Object_Name: 'V_SALES_REPORT',      Object_Type: 'View',     Complexity: 'High',     Migration_Pattern: 'Partially Automated', Automation_Pct: '50%', Efforts_PD: 1.50, Notes: 'PIVOT clause must be rewritten' },
        { Object_Name: 'V_INVENTORY_STATUS',  Object_Type: 'View',     Complexity: 'Low',      Migration_Pattern: 'Automated',           Automation_Pct: '90%', Efforts_PD: 0.25, Notes: '' },
        { Object_Name: 'V_PAYMENT_SUMMARY',   Object_Type: 'View',     Complexity: 'Medium',   Migration_Pattern: 'Partially Automated', Automation_Pct: '65%', Efforts_PD: 0.75, Notes: '' },
        { Object_Name: 'V_LEGACY_REPORT',     Object_Type: 'View',     Complexity: 'Complex',  Migration_Pattern: 'Partially Automated', Automation_Pct: '30%', Efforts_PD: 3.00, Notes: 'Deprecated — consider dropping' },
        { Object_Name: 'V_PRODUCT_CATALOG',   Object_Type: 'View',     Complexity: 'Low',      Migration_Pattern: 'Automated',           Automation_Pct: '90%', Efforts_PD: 0.25, Notes: '' },
        // Triggers
        { Object_Name: 'TRG_ORDER_AUDIT',     Object_Type: 'Trigger',  Complexity: 'Low',      Migration_Pattern: 'Automated',           Automation_Pct: '90%', Efforts_PD: 0.50, Notes: '' },
        { Object_Name: 'TRG_PAYMENT_LOG',     Object_Type: 'Trigger',  Complexity: 'Medium',   Migration_Pattern: 'Automated',           Automation_Pct: '85%', Efforts_PD: 0.75, Notes: '' },
        { Object_Name: 'TRG_INVENTORY_CHK',   Object_Type: 'Trigger',  Complexity: 'Low',      Migration_Pattern: 'Automated',           Automation_Pct: '90%', Efforts_PD: 0.55, Notes: '' },
        // Stored Procedures
        { Object_Name: 'SP_ORDER_PROCESS',    Object_Type: 'Procedure',Complexity: 'High',     Migration_Pattern: 'Partially Automated', Automation_Pct: '40%', Efforts_PD: 3.50, Notes: 'Dynamic SQL rewrite required' },
        { Object_Name: 'SP_CUSTOMER_SYNC',    Object_Type: 'Procedure',Complexity: 'Medium',   Migration_Pattern: 'Partially Automated', Automation_Pct: '50%', Efforts_PD: 2.00, Notes: '' },
        { Object_Name: 'SP_REPORT_GEN',       Object_Type: 'Procedure',Complexity: 'Complex',  Migration_Pattern: 'Partially Automated', Automation_Pct: '25%', Efforts_PD: 5.50, Notes: 'Complex cursor logic — manual rewrite needed' },
        { Object_Name: 'SP_DATA_ARCHIVE',     Object_Type: 'Procedure',Complexity: 'Low',      Migration_Pattern: 'Partially Automated', Automation_Pct: '60%', Efforts_PD: 1.25, Notes: '' },
        { Object_Name: 'SP_BATCH_UPDATE',     Object_Type: 'Procedure',Complexity: 'High',     Migration_Pattern: 'Partially Automated', Automation_Pct: '35%', Efforts_PD: 4.00, Notes: 'Bulk collect/FORALL patterns' },
        { Object_Name: 'SP_PAYMENT_PROC',     Object_Type: 'Procedure',Complexity: 'Complex',  Migration_Pattern: 'Partially Automated', Automation_Pct: '20%', Efforts_PD: 7.00, Notes: 'Oracle-specific exception handling' },
        // Functions
        { Object_Name: 'FN_CALC_TAX',         Object_Type: 'Function', Complexity: 'Low',      Migration_Pattern: 'Partially Automated', Automation_Pct: '70%', Efforts_PD: 0.75, Notes: '' },
        { Object_Name: 'FN_GET_DISCOUNT',     Object_Type: 'Function', Complexity: 'Low',      Migration_Pattern: 'Automated',           Automation_Pct: '85%', Efforts_PD: 0.50, Notes: '' },
        { Object_Name: 'FN_FORMAT_PHONE',     Object_Type: 'Function', Complexity: 'Very Low', Migration_Pattern: 'Automated',           Automation_Pct: '95%', Efforts_PD: 0.25, Notes: '' },
        { Object_Name: 'FN_ORDER_TOTAL',      Object_Type: 'Function', Complexity: 'Medium',   Migration_Pattern: 'Partially Automated', Automation_Pct: '55%', Efforts_PD: 1.50, Notes: 'NVL/DECODE usage' },
        { Object_Name: 'FN_VALIDATE_EMAIL',   Object_Type: 'Function', Complexity: 'Very Low', Migration_Pattern: 'Automated',           Automation_Pct: '95%', Efforts_PD: 0.25, Notes: '' },
        { Object_Name: 'FN_CALC_SHIPPING',    Object_Type: 'Function', Complexity: 'Medium',   Migration_Pattern: 'Partially Automated', Automation_Pct: '50%', Efforts_PD: 1.50, Notes: '' },
        { Object_Name: 'FN_INVENTORY_LEVEL',  Object_Type: 'Function', Complexity: 'Low',      Migration_Pattern: 'Partially Automated', Automation_Pct: '60%', Efforts_PD: 0.75, Notes: '' },
      ]
    }
  },
}
