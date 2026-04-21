import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Públicas
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// Admin
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Services from './pages/Services'
import Customers from './pages/Customers'
import AdminUsers from './pages/admin/AdminUsers'

// Owner
import OwnerDashboard from './pages/owner/OwnerDashboard'
import OwnerServices from './pages/owner/OwnerServices'
import OwnerAppointments from './pages/owner/OwnerAppointments'
import OwnerCustomers from './pages/owner/OwnerCustomers'
import OwnerProfile from './pages/owner/OwnerProfile'

// Client
import ClientDashboard from './pages/client/ClientDashboard'
import ClientServices from './pages/client/ClientServices'
import ClientAppointments from './pages/client/ClientAppointments'
import ClientProfile from './pages/client/ClientProfile'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/dashboard"    element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute allowedRoles={['admin']}><Appointments /></ProtectedRoute>} />
          <Route path="/services"     element={<ProtectedRoute allowedRoles={['admin']}><Services /></ProtectedRoute>} />
          <Route path="/customers"    element={<ProtectedRoute allowedRoles={['admin']}><Customers /></ProtectedRoute>} />
          <Route path="/admin/users"  element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />

          {/* Owner */}
          <Route path="/owner/dashboard"    element={<ProtectedRoute allowedRoles={['business_owner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/services"     element={<ProtectedRoute allowedRoles={['business_owner']}><OwnerServices /></ProtectedRoute>} />
          <Route path="/owner/appointments" element={<ProtectedRoute allowedRoles={['business_owner']}><OwnerAppointments /></ProtectedRoute>} />
          <Route path="/owner/customers"    element={<ProtectedRoute allowedRoles={['business_owner']}><OwnerCustomers /></ProtectedRoute>} />
          <Route path="/owner/profile"      element={<ProtectedRoute allowedRoles={['business_owner']}><OwnerProfile /></ProtectedRoute>} />

          {/* Client */}
          <Route path="/client/dashboard"    element={<ProtectedRoute allowedRoles={['customer']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client/services"     element={<ProtectedRoute allowedRoles={['customer']}><ClientServices /></ProtectedRoute>} />
          <Route path="/client/appointments" element={<ProtectedRoute allowedRoles={['customer']}><ClientAppointments /></ProtectedRoute>} />
          <Route path="/client/profile"      element={<ProtectedRoute allowedRoles={['customer']}><ClientProfile /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
