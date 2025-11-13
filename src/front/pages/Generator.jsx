import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useDarkMode } from '../context/DarkModeContext'

import { CATEGORIES, STYLE_MODS } from '../utils/generatorData'
import { getGeneratorData, generateNames } from '../utils/generatorClient'
import Spinner from '../components/Spinner'

export const Generator = () => {
    const { darkMode } = useDarkMode()
    const navigate = useNavigate()
    const [category, setCategory] = useState('rpg')
    const [style, setStyle] = useState('fantasy')
    const [count, setCount] = useState(8)
    const [mandatory, setMandatory] = useState('')
    const [results, setResults] = useState([])
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [serverPrefixes, setServerPrefixes] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Intentamos obtener datos protegidos del servidor; si el token es inválido redirigimos a login
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) return // ProtectedRoute ya redirige, pero evitamos peticiones si no hay token

        setLoading(true)
        getGeneratorData().then(async res => {
            if (res.status === 401 || res.status === 403) {
                // token inválido o expirado
                localStorage.removeItem('token')
                navigate('/login')
                return
            }
            if (!res.ok) return
            const data = await res.json()
            if (data && data.server_prefixes) setServerPrefixes(data.server_prefixes)
        }).catch(err => {
            // No hacemos nada en fallo de red; el generador funciona en cliente
            console.warn('No se pudo obtener datos protegidos:', err)
        }).finally(() => setLoading(false))
    }, [navigate])

    const generate = async () => {
        try {
            setLoading(true)
            const res = await generateNames({ category, style, count, mandatory })
            if (res.status === 401 || res.status === 403) {
                // Token inválido/expirado
                localStorage.removeItem('token')
                navigate('/login')
                return
            }

            if (!res.ok) {
                console.warn('Error al generar en servidor', res.status)
                return
            }

            const data = await res.json()
            if (data && Array.isArray(data.results)) {
                setResults(data.results)
            }
        } catch (err) {
            console.warn('Fallo al conectar con backend para generar:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateClick = () => {
        if (results.length > 0) {
            setShowConfirmModal(true)
        } else {
            generate()
        }
    }

    const confirmGenerate = () => {
        setShowConfirmModal(false)
        generate()
    }

    return (
        <div className={`py-12 ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-black'}`}>
            <Spinner active={loading} delay={3000} transparentBackground={true} />
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-emerald-300 mb-2">Generador de nombres</h2>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Crea nombres únicos para personajes de rol, shooters o battle royale en segundos. Elige una categoría, mezcla estilos y obtén propuestas listas para usar en tus partidas.</p>
                    </div>
                </div>

                <div className={`p-6 rounded-lg shadow mb-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="mb-4">
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : ''}`}>Categoría</label>
                        <div className="flex gap-4 flex-wrap">
                            {Object.keys(CATEGORIES).map(k => (
                                <label key={k} className="inline-flex items-center gap-2">
                                    <input type="radio" name="category" value={k} checked={category === k} onChange={e => setCategory(e.target.value)} />
                                    <span className="text-sm">{CATEGORIES[k].label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Cantidad (máx. 10)</label>
                            <input type="number" min="1" max="10" value={count} onChange={e => setCount(Math.min(10, Number(e.target.value)))} className={`w-full border rounded px-3 py-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Palabra/letras obligatorias</label>
                            <input type="text" placeholder="ej: Dark, X, ..." value={mandatory} onChange={e => setMandatory(e.target.value)} className={`w-full border rounded px-3 py-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300'}`} />
                        </div>

                        <div className="flex gap-2">
                            <button disabled={loading} onClick={handleGenerateClick} className={`bg-emerald-300 text-black px-4 py-2 rounded font-semibold ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>Generar</button>
                            <button disabled={loading} onClick={() => { setResults([]) }} className={`border px-4 py-2 rounded ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>Limpiar</button>
                        </div>
                    </div>

                    {serverPrefixes.length > 0 && (
                        <div className="mt-4">
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : ''}`}>Prefijos del servidor</label>
                            <div className="flex gap-2 flex-wrap">
                                {serverPrefixes.map((p, i) => (
                                    <span key={i} className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-sm">{p}</span>
                                ))}
                            </div>
                        </div>
                    )}


                </div>

                <div>
                    {results.length === 0 ? (
                        <div className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Pulsa Generar para obtener nombres.</div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {results.map((r, idx) => (
                                <div key={idx} className={`flex items-center justify-between rounded px-4 py-3 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <div className="font-medium">{r}</div>
                                    <div className="flex items-center gap-2">
                                        <CopyToClipboard text={r}>
                                            <button className={`text-sm px-3 py-1 border rounded ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}>Copiar</button>
                                        </CopyToClipboard>
                                        <button onClick={() => navigator.clipboard.writeText(r)} className="text-sm px-3 py-1 border rounded hidden">Copy2</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`rounded-lg shadow-lg max-w-md w-full p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <h3 className="text-xl font-bold text-emerald-300 mb-3">¿Estás seguro?</h3>
                        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            ¡Hey! ¿ Estás seguro de que no quieres elegir ningún nombre? Ten en cuenta que si presionas de nuevo "Generar" se perderán estos nombres.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowConfirmModal(false)} className={`border px-4 py-2 rounded font-semibold ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
                                Cancelar
                            </button>
                            <button disabled={loading} onClick={confirmGenerate} className={`bg-emerald-300 text-black px-4 py-2 rounded font-semibold hover:bg-emerald-400 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                Generar de todas formas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Generator
