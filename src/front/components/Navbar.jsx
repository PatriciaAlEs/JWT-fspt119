import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext"
import React, { useEffect, useState } from "react"

export const Navbar = () => {
	const { darkMode, toggleDarkMode } = useDarkMode()
	const [isLogged, setIsLogged] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
		setIsLogged(!!token)

		const onStorage = (e) => {
			if (e.key === 'token') setIsLogged(!!e.newValue)
		}

		const onAuthChange = () => {
			const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
			setIsLogged(!!t)
		}

		window.addEventListener('storage', onStorage)
		window.addEventListener('auth-change', onAuthChange)
		return () => {
			window.removeEventListener('storage', onStorage)
			window.removeEventListener('auth-change', onAuthChange)
		}
	}, [])

	const handleLogout = () => {
		localStorage.removeItem('token')
		setIsLogged(false)
		navigate('/')
		// notify other listeners in this tab
		window.dispatchEvent(new Event('auth-change'))
	}

	return (
		<header className={`shadow ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
			<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
				<Link to="/" className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-md bg-emerald-300 flex items-center justify-center font-bold text-black">G</div>
					<span className="text-xl font-semibold">NameGen</span>
				</Link>

				{/* Contenedor de navegación y modo claro/oscuro */}
				<div className="flex items-center md:gap-6 gap-2 ml-auto">
					{/* Menú normal en desktop */}
					<nav className="hidden md:flex items-center gap-3">
						{isLogged ? (
							<>
								<Link to="/profile" className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-gray-800 transition" title="Editar perfil">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
										<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
									</svg>
								</Link>
								<button onClick={handleLogout} className={`text-sm font-medium px-3 py-1 rounded transform transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg ${darkMode ? 'bg-emerald-400 text-black' : 'bg-emerald-300 text-black'}`}>
									Cerrar sesión
								</button>
							</>
						) : (
							<>
								<Link to="/register" className={`text-sm font-medium px-3 py-1 rounded transform transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg ${darkMode ? 'bg-emerald-400 text-black' : 'bg-emerald-300 text-black'}`}>
									Regístrate
								</Link>
								<Link to="/login" className={`text-sm font-medium px-3 py-1 rounded transform transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg ${darkMode ? 'border border-gray-600 text-gray-300 hover:bg-gray-800' : 'border border-black text-black hover:text-emerald-300'}`}>
									Entrar
								</Link>
							</>
						)}
					</nav>

					{/* Botón modo claro/oscuro SIEMPRE visible y más a la derecha en desktop */}
					<button onClick={toggleDarkMode} className={`text-sm font-medium px-3 py-1 rounded transition ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} md:ml-8 ml-2`}>
						{darkMode ? '☀️' : '🌙'}
					</button>

					{/* Hamburguesa solo en móviles */}
					<button className="md:hidden ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</div>

			{/* Menú hamburguesa en móviles */}
			{menuOpen && (
				<nav className={`md:hidden flex flex-col items-end gap-2 px-6 py-3 bg-emerald-50 dark:bg-gray-900 border-t border-emerald-200 dark:border-gray-800 shadow-lg z-50`}>
					{isLogged ? (
						<button onClick={() => { setMenuOpen(false); handleLogout(); }} className={`w-full text-left text-sm font-medium px-3 py-2 rounded transform transition duration-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 ${darkMode ? 'bg-emerald-400 text-black' : 'bg-emerald-300 text-black'}`}>
							Cerrar sesión
						</button>
					) : (
						<>
							<Link to="/register" onClick={() => setMenuOpen(false)} className={`w-full text-left text-sm font-medium px-3 py-2 rounded transform transition duration-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 ${darkMode ? 'bg-emerald-400 text-black' : 'bg-emerald-300 text-black'}`}>
								Regístrate
							</Link>
							<Link to="/login" onClick={() => setMenuOpen(false)} className={`w-full text-left text-sm font-medium px-3 py-2 rounded transform transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-800 ${darkMode ? 'border border-gray-600 text-gray-300' : 'border border-black text-black'}`}>
								Entrar
							</Link>
						</>
					)}
				</nav>
			)}
		</header>
	)
}