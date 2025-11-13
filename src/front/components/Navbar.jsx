import { Link } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext"

export const Navbar = () => {
	const { darkMode, toggleDarkMode } = useDarkMode()

	return (
		<header className={`shadow ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
			<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
				<Link to="/" className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-md bg-emerald-300 flex items-center justify-center font-bold text-black">G</div>
					<span className="text-xl font-semibold">NameGen</span>
				</Link>

				<nav className="flex items-center gap-3">
					<Link to="/generator" className={`text-sm font-medium hover:underline ${darkMode ? 'text-gray-300 hover:text-white' : 'text-black'}`}>Generador</Link>
					<Link to="/register" className="text-sm font-medium text-emerald-300 hover:underline">Regístrate</Link>
					<Link to="/login" className={`text-sm font-medium border px-3 py-1 rounded transition ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-black text-black hover:bg-black hover:text-white'}`}>Entrar</Link>
					<button onClick={toggleDarkMode} className={`text-sm font-medium px-3 py-1 rounded transition ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
						{darkMode ? '☀️' : '🌙'}
					</button>
				</nav>
			</div>
		</header>
	)
}