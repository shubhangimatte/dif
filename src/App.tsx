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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected — all authenticated users */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/data-volume" element={<PrivateRoute><DataVolume /></PrivateRoute>} />
          <Route path="/user-table" element={<PrivateRoute><UserTable /></PrivateRoute>} />
          <Route path="/table-fields" element={<PrivateRoute><TableFieldListing /></PrivateRoute>} />
          <Route path="/assessment/:dbId" element={<PrivateRoute><AssessmentDashboard /></PrivateRoute>} />

          {/* Protected — all authenticated users */}
          <Route path="/realtime-extraction" element={<PrivateRoute><RealtimeExtraction /></PrivateRoute>} />
          <Route path="/import-report"       element={<PrivateRoute><ImportDBReport /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
