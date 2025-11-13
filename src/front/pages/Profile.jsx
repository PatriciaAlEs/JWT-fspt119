import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

export const Profile = () => {
    const { darkMode } = useDarkMode();
    const [user, setUser] = useState({ email: '', name: '', password: '' });
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'edit' | 'delete'
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener datos del usuario actual
        const fetchUser = async () => {
            setLoading(true);
            try {
                const backend = import.meta.env.VITE_BACKEND_URL || '';
                const token = localStorage.getItem('token');
                const res = await fetch(backend + '/api/profile', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });

                const data = await res.json();
                if (res.ok) setUser({ email: data.email, name: data.name, password: '' });
                else setMsg({ type: 'error', text: data.msg || 'Error al cargar perfil' });
            } catch (err) {
                setMsg({ type: 'error', text: err.message });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleEdit = e => {
        e.preventDefault();
        setModalType('edit');
        setShowModal(true);
    };

    const confirmEdit = async () => {
        setShowModal(false);
        setLoading(true);
        setMsg(null);
        try {
            const backend = import.meta.env.VITE_BACKEND_URL || '';
            const token = localStorage.getItem('token');
            const res = await fetch(backend + '/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(user)
            });

            const data = await res.json();
            if (res.ok) setMsg({ type: 'success', text: 'Datos actualizados correctamente.' });
            else setMsg({ type: 'error', text: data.msg || 'Error al actualizar datos.' });
        } catch (err) {
            setMsg({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        setModalType('delete');
        setShowModal(true);
    };

    const confirmDelete = async () => {
        setShowModal(false);
        setLoading(true);
        setMsg(null);
        try {
            const backend = import.meta.env.VITE_BACKEND_URL || '';
            const token = localStorage.getItem('token');
            const res = await fetch(backend + '/api/profile', {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (res.ok) {
                localStorage.removeItem('token');
                setMsg({ type: 'success', text: 'Cuenta eliminada. Redirigiendo...' });
                setTimeout(() => navigate('/'), 1500);
            } else {
                const data = await res.json();
                setMsg({ type: 'error', text: data.msg || 'Error al eliminar cuenta.' });
            }
        } catch (err) {
            setMsg({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex items-center justify-center py-12 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
            <div className={`w-full max-w-md p-8 rounded-xl border-2 border-emerald-300/80 shadow-2xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-2xl font-bold mb-4 text-emerald-300 text-center">Editar perfil</h2>
                <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Email</label>
                        <input name="email" type="email" value={user.email} onChange={handleChange} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Nombre</label>
                        <input name="name" type="text" value={user.name} onChange={handleChange} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : ''}`}>Contraseña</label>
                        <input name="password" type="password" value={user.password} onChange={handleChange} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" disabled={loading} className={`bg-emerald-300 text-black font-semibold px-4 py-2 rounded border-2 border-emerald-300 shadow-md transform transition duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}`}>Guardar cambios</button>
                        <button type="button" onClick={handleDelete} className={`bg-red-400 text-white font-semibold px-4 py-2 rounded border-2 border-red-400 shadow-md transform transition duration-200 hover:shadow-lg hover:-translate-y-0.5`}>Eliminar cuenta</button>
                    </div>
                </form>
                <Spinner active={loading} delay={3000} transparentBackground={true} />
                {msg && (
                    <div className={`mt-4 p-3 rounded ${msg.type === 'success' ? (darkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-800') : (darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')}`}>
                        {msg.text}
                    </div>
                )}
                {/* Modal de confirmación */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className={`p-6 rounded-xl shadow-xl max-w-sm w-full ${modalType === 'delete' ? 'bg-red-100 text-red-800' : (darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black')}`}>
                            <h3 className="text-lg font-bold mb-4">
                                {modalType === 'delete' ? '¿Seguro que quieres eliminar tu cuenta?' : '¿Guardar los cambios en tu perfil?'}
                            </h3>
                            <div className="flex gap-4 justify-end">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-300 text-black font-semibold">Cancelar</button>
                                {modalType === 'delete' ? (
                                    <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-500 text-white font-semibold">Eliminar</button>
                                ) : (
                                    <button onClick={confirmEdit} className="px-4 py-2 rounded bg-emerald-500 text-white font-semibold">Guardar</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
