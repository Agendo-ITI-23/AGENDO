import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Appointments from './pages/Appointments'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/login" element={<div className="min-h-screen flex items-center justify-center bg-gray-50"><h1 className="text-2xl">Iniciar Sesión - Próximamente</h1></div>} />
        <Route path="/register" element={<div className="min-h-screen flex items-center justify-center bg-gray-50"><h1 className="text-2xl">Registro - Próximamente</h1></div>} />
        <Route path="/about" element={<div className="min-h-screen flex items-center justify-center bg-gray-50"><h1 className="text-2xl">Acerca de - Próximamente</h1></div>} />
      </Routes>
    </Router>
  )
}

export default App
