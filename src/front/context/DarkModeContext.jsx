import React, { createContext, useState, useContext } from 'react'

const DarkModeContext = createContext()

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false)

    const toggleDarkMode = () => setDarkMode(!darkMode)

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}

export const useDarkMode = () => {
    const context = useContext(DarkModeContext)
    if (!context) {
        throw new Error('useDarkMode debe usarse dentro de DarkModeProvider')
    }
    return context
}
