import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/capgemini.css'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DataVolume from './pages/DataVolume'
import UserTable from './pages/UserTable'
import RealtimeExtraction from './pages/RealtimeExtraction'
import ImportDBReport from './pages/ImportDBReport'
import TableFieldListing from './pages/TableFieldListing'
import AssessmentDashboard from './pages/AssessmentDashboard'
import Datatype from './pages/Datatype'
import Views from './pages/Views'
import StoredProcedures from './pages/StoredProcedures'
import Functions from './pages/Functions'
import Indexes from './pages/Indexes'
import Triggers from './pages/Triggers'
import EntityRelationship from './pages/EntityRelationship'
import IOTransaction from './pages/IOTransaction'
import EstimationSummary from './pages/EstimationSummary'
import SetupNewClient from './pages/SetupNewClient'
import SetupProject from './pages/SetupProject'
import StoredProcedureChart from './pages/StoredProcedureChart'
import TechnicalOverheads from './pages/TechnicalOverheads'
import ClientDetails from './pages/ClientDetails'
import UserAccess from './pages/UserAccess'
import DetailedEstimations from './pages/DetailedEstimations'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected — all authenticated users */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/data-volume"           element={<PrivateRoute><DataVolume /></PrivateRoute>} />
          <Route path="/user-table"            element={<PrivateRoute><UserTable /></PrivateRoute>} />
          <Route path="/table-fields"          element={<PrivateRoute><TableFieldListing /></PrivateRoute>} />
          <Route path="/assessment/:dbId"      element={<PrivateRoute><AssessmentDashboard /></PrivateRoute>} />
          <Route path="/datatype"              element={<PrivateRoute><Datatype /></PrivateRoute>} />
          <Route path="/views"                 element={<PrivateRoute><Views /></PrivateRoute>} />
          <Route path="/stored-procedures"     element={<PrivateRoute><StoredProcedures /></PrivateRoute>} />
          <Route path="/functions"             element={<PrivateRoute><Functions /></PrivateRoute>} />
          <Route path="/indexes"               element={<PrivateRoute><Indexes /></PrivateRoute>} />
          <Route path="/triggers"              element={<PrivateRoute><Triggers /></PrivateRoute>} />
          <Route path="/entity-relationship"   element={<PrivateRoute><EntityRelationship /></PrivateRoute>} />
          <Route path="/io-transaction"        element={<PrivateRoute><IOTransaction /></PrivateRoute>} />
          <Route path="/estimation-summary"    element={<PrivateRoute><EstimationSummary /></PrivateRoute>} />
          <Route path="/setup-new-client"      element={<PrivateRoute><SetupNewClient /></PrivateRoute>} />
          <Route path="/setup-project"         element={<PrivateRoute><SetupProject /></PrivateRoute>} />
          <Route path="/sp-chart"              element={<PrivateRoute><StoredProcedureChart /></PrivateRoute>} />
          <Route path="/technical-overheads"   element={<PrivateRoute><TechnicalOverheads /></PrivateRoute>} />
          <Route path="/client-details"        element={<PrivateRoute><ClientDetails /></PrivateRoute>} />
          <Route path="/user-access"           element={<PrivateRoute><UserAccess /></PrivateRoute>} />
          <Route path="/detailed-estimations" element={<PrivateRoute><DetailedEstimations /></PrivateRoute>} />

          {/* Protected — data load utility */}
          <Route path="/realtime-extraction" element={<PrivateRoute><RealtimeExtraction /></PrivateRoute>} />
          <Route path="/import-report"       element={<PrivateRoute><ImportDBReport /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
