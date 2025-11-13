import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const location = useLocation()
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    if (!token) {
        // Redirect to login, preserve the location to come back after login if needed
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute
