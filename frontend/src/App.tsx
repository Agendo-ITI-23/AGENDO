import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Appointments from './pages/Appointments'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<div className="min-h-screen flex items-center justify-center bg-gray-50"><h1 className="text-2xl">Acerca de - Próximamente</h1></div>} />
          
          {/* Rutas protegidas */}
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } 
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
