import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { DarkModeProvider, useDarkMode } from "../context/DarkModeContext"

const LayoutContent = () => {
    const { darkMode } = useDarkMode()

    return (
        <div className={darkMode ? 'bg-gray-950 text-white' : 'bg-white text-black'}>
            <ScrollToTop>
                <Navbar />
                <Outlet />
                <Footer />
            </ScrollToTop>
        </div>
    )
}

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <DarkModeProvider>
            <LayoutContent />
        </DarkModeProvider>
    )
}