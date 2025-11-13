import React, { useState } from 'react'
import Spinner from '../components/Spinner'
import { useNavigate } from 'react-router-dom'
import { useDarkMode } from '../context/DarkModeContext'

export const Login = () => {
    const { darkMode } = useDarkMode()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMsg(null)
        try {
            setLoading(true)
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
                // notify other listeners in this tab
                window.dispatchEvent(new Event('auth-change'))
                setMsg({ type: 'success', text: 'Login correcto. Redirigiendo al generador...' })
                setTimeout(() => navigate('/generator'), 800)
            } else {
                setMsg({ type: 'error', text: data.msg || 'Credenciales inválidas' })
            }
        } catch (err) {
            setMsg({ type: 'error', text: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`flex items-center justify-center py-12 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
            <div className={`w-full max-w-md p-8 rounded-xl border-2 border-emerald-300/80 shadow-2xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-2xl font-bold mb-4 text-emerald-300 text-center">Iniciar sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Email</label>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Contraseña</label>
                        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                    </div>

                    <div className="flex items-center justify-end">
                        <button disabled={loading} className={`bg-emerald-300 text-black font-semibold px-4 py-2 rounded border-2 border-emerald-300 shadow-md transform transition duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}`}>Entrar</button>
                    </div>
                </form>

                <Spinner active={loading} delay={3000} transparentBackground={true} />

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
