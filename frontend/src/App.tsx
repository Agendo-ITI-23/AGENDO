import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    // Verificar conexión con el backend
    fetch(`${apiUrl}/api/health`)
      .then(response => {
        if (response.ok) {
          setApiStatus('connected')
        } else {
          setApiStatus('error')
        }
      })
      .catch(() => {
        setApiStatus('error')
      })
  }, [apiUrl])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>AGENDO - Vite + React + Laravel</h1>
      
      <div style={{ 
        padding: '10px', 
        marginBottom: '20px', 
        borderRadius: '5px',
        backgroundColor: apiStatus === 'connected' ? '#4caf50' : apiStatus === 'error' ? '#f44336' : '#ff9800'
      }}>
        <p style={{ margin: 0, color: 'white' }}>
          Backend Status: {
            apiStatus === 'checking' ? '🔄 Verificando...' :
            apiStatus === 'connected' ? '✅ Conectado' :
            '❌ Desconectado'
          }
        </p>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Sistema de reservas y gestión de citas
      </p>
    </>
  )
}

export default App
