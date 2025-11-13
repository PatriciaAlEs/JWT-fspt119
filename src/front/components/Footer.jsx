import { useDarkMode } from "../context/DarkModeContext"

export const Footer = () => {
	const { darkMode } = useDarkMode()

	return (
		<footer className={`footer mt-auto py-3 text-center ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-black'}`}>
			<p>
				Check the <a target="_blank" href="https://4geeks.com/docs/start/react-flask-template" className={`${darkMode ? 'text-emerald-300 hover:underline' : 'text-emerald-300 hover:underline'}`}>template documentation</a> <i className="fa-solid fa-file"></i> for help.
			</p>
			<p>
				Made with <i className="fa fa-heart text-danger" /> by{" "}
				<a href="http://www.4geeksacademy.com" className={`${darkMode ? 'text-emerald-300 hover:underline' : 'text-emerald-300 hover:underline'}`}>4Geeks Academy</a>
			</p>
		</footer>
	)
};
