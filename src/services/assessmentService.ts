import api from '../api/api'

export interface AssessmentSummary {
  tablesCount: number
  fieldCount: number
  datatypeCount: number
  storedproCount: number
  funCount: number
  viewCount: number
  rowSum: number
  dbSum: number
}

export interface ComplexityRow {
  name: string
  total_count: number
  vlowcount: number
  lowcount: number
  mediumcount: number
  highcount: number
  complexcount: number
}

export interface AssessmentData {
  dbname: string
  summary: AssessmentSummary
  complexity: ComplexityRow[]
}

const MOCK_DATA = (dbId: string | number): AssessmentData => ({
  dbname: `Database_${dbId}`,
  summary: {
    tablesCount: 347, fieldCount: 4820, datatypeCount: 42,
    storedproCount: 93, funCount: 41, viewCount: 82,
    rowSum: 4200000, dbSum: 43315
  },
  complexity: [
    { name: 'Tables',     total_count: 347, vlowcount: 128, lowcount: 93,  mediumcount: 87, highcount: 32, complexcount: 7  },
    { name: 'Views',      total_count: 82,  vlowcount: 34,  lowcount: 28,  mediumcount: 14, highcount: 6,  complexcount: 0  },
    { name: 'Functions',  total_count: 41,  vlowcount: 12,  lowcount: 15,  mediumcount: 9,  highcount: 4,  complexcount: 1  },
    { name: 'Procedures', total_count: 93,  vlowcount: 28,  lowcount: 31,  mediumcount: 22, highcount: 10, complexcount: 2  },
    { name: 'Triggers',   total_count: 18,  vlowcount: 8,   lowcount: 6,   mediumcount: 3,  highcount: 1,  complexcount: 0  },
  ]
})

export const assessmentService = {
  getData: async (dbId: string | number): Promise<AssessmentData> => {
    try { return await api.get(`/Assdashboard/getData/${dbId}`) }
    catch { return MOCK_DATA(dbId) }
  }
}
