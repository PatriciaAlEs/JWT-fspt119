import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useDarkMode } from '../context/DarkModeContext'

const CATEGORIES = {
    rpg: {
        label: 'Rol / Fantasía',
        prefixes: ['Aer', 'Bel', 'Cal', 'Dor', 'El', 'Fin', 'Gal', 'Har', 'Ith', 'Jar', 'Kel', 'Lun', 'Mor', 'Ner', 'Or', 'Pel', 'Qir', 'Ryn', 'Sol', 'Tor'],
        middles: ['an', 'or', 'en', 'is', 'ar', 'il', 'us', 'ath', 'ion', 'el', 'ir'],
        suffixes: ['dor', 'wen', 'thas', 'mar', 'gorn', 'dil', 'wyn', 'nor', 'ion', 'rus', 'mir', 'thil']
    },
    shooter: {
        label: 'Shooter',
        prefixes: ['Ghost', 'Viper', 'Zero', 'Alpha', 'Blaze', 'Raptor', 'Strike', 'Delta', 'Nova', 'Echo', 'Reaper', 'Shadow', 'Specter'],
        middles: ['_', '-', 'X', '', 'Z', 'Rx'],
        suffixes: ['01', '99', 'Pro', 'Elite', 'Sniper', 'Shot', 'Ops', 'Core', 'Edge']
    },
    br: {
        label: 'Battle Royale',
        prefixes: ['Sky', 'Storm', 'Grim', 'Wild', 'Iron', 'Titan', 'Prime', 'Blade', 'Rogue', 'Pulse', 'Venom', 'Apex', 'Crimson', 'Vortex', 'Phantom'],
        middles: ['', '-', '_', '', 'X', 'Rx', 'Z'],
        suffixes: ['Survivor', 'Runner', 'King', 'Queen', 'Slayer', 'Champion', 'Drift', 'Edge', 'Hunter', 'Breaker', 'Master']
    }
}

const STYLE_MODS = {
    fantasy: { label: 'Fantasía' },
    futuristic: { label: 'Futurista' },
    grim: { label: 'Oscuro' },
    silly: { label: 'Divertido' }
}

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function applyStyle(name, styles) {
    // simple modifiers based on styles
    let out = name
    if (styles.fantasy) out = out.replace(/X/g, 'a').replace(/0/g, 'o')
    if (styles.futuristic) out = out.split('').map((c, i) => i % 2 ? c.toUpperCase() : c).join('')
    if (styles.grim) out = out.replace(/[aeiou]/gi, '')
    if (styles.silly) out = out + rand(['~', '!!', '_o_', '~'])
    return out
}

export const Generator = () => {
    const { darkMode } = useDarkMode()
    const [category, setCategory] = useState('rpg')
    const [styles, setStyles] = useState({ fantasy: true, futuristic: false, grim: false, silly: false })
    const [count, setCount] = useState(8)
    const [mandatory, setMandatory] = useState('')
    const [results, setResults] = useState([])
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const generateOne = () => {
        const cat = CATEGORIES[category]
        let a = rand(cat.prefixes)
        const b = rand(cat.middles)
        const c = rand(cat.suffixes)

        // Si hay palabra obligatoria, sustituye al prefijo
        if (mandatory.trim()) {
            // Capitaliza la primera letra si es minúscula
            a = mandatory.charAt(0).toUpperCase() + mandatory.slice(1)
        }

        let name = `${a}${b}${c}`
        name = applyStyle(name, styles)
        return name
    }

    const generate = () => {
        const list = []
        for (let i = 0; i < count; i++) list.push(generateOne())
        setResults(list)
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

    const toggleStyle = (k) => setStyles(s => ({ ...s, [k]: !s[k] }))

    return (
        <div className={`min-h-screen py-12 ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-black'}`}>
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
                            <button onClick={handleGenerateClick} className="bg-emerald-300 text-black px-4 py-2 rounded font-semibold">Generar</button>
                            <button onClick={() => { setResults([]) }} className="border px-4 py-2 rounded">Limpiar</button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : ''}`}>Estilos (mezcla)</label>
                        <div className="flex gap-3 flex-wrap">
                            {Object.keys(STYLE_MODS).map(k => (
                                <label key={k} className="inline-flex items-center gap-2">
                                    <input type="checkbox" checked={styles[k]} onChange={() => toggleStyle(k)} />
                                    <span className="text-sm">{STYLE_MODS[k].label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
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
                            <button onClick={confirmGenerate} className="bg-emerald-300 text-black px-4 py-2 rounded font-semibold hover:bg-emerald-400">
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
