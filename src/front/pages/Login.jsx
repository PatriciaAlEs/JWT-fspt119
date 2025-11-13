import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDarkMode } from '../context/DarkModeContext'

export const Login = () => {
    const { darkMode } = useDarkMode()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMsg(null)
        try {
            const backend = import.meta.env.VITE_BACKEND_URL || ''
            const res = await fetch(backend + '/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json()
            if (res.ok && data.token) {
                // guardar token en localStorage
                localStorage.setItem('token', data.token)
                setMsg({ type: 'success', text: 'Login correcto. Redirigiendo...' })
                setTimeout(() => navigate('/'), 800)
            } else {
                setMsg({ type: 'error', text: data.msg || 'Credenciales inválidas' })
            }
        } catch (err) {
            setMsg({ type: 'error', text: err.message })
        }
    }

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
            <div className={`w-full max-w-md p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
                <h2 className="text-2xl font-bold mb-4 text-emerald-300">Iniciar sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Email</label>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Contraseña</label>
                        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                    </div>

                    <div className="flex items-center justify-between">
                        <button className="bg-emerald-300 text-black font-semibold px-4 py-2 rounded">Entrar</button>
                        <a className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`} href="/forgot">¿Olvidaste tu contraseña?</a>
                    </div>
                </form>

                {msg && (
                    <div className={`mt-4 p-3 rounded ${msg.type === 'success' ? (darkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-800') : (darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')}`}>
                        {msg.text}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login
