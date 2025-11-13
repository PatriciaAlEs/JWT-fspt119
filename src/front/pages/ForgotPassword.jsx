import React, { useState } from 'react'
import { useDarkMode } from '../context/DarkModeContext'

export const ForgotPassword = () => {
    const { darkMode } = useDarkMode()
    const [email, setEmail] = useState('')
    const [msg, setMsg] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMsg(null)
        try {
            const backend = import.meta.env.VITE_BACKEND_URL || ''
            const res = await fetch(backend + '/recover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await res.json()
            if (res.ok) setMsg({ type: 'success', text: data.msg || 'Si el email existe, se ha enviado un enlace de recuperación.' })
            else setMsg({ type: 'error', text: data.msg || 'No se encontró el email' })
        } catch (err) {
            setMsg({ type: 'error', text: err.message })
        }
    }

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
            <div className={`w-full max-w-md p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
                <h2 className="text-2xl font-bold mb-4 text-emerald-300">Recuperar contraseña</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Email</label>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-emerald-300 text-black font-semibold px-4 py-2 rounded">Enviar</button>
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

export default ForgotPassword
