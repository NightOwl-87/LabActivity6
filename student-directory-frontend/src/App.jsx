import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Students from './pages/Students';

import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

import './App.css';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Redirect the homepage */}
            <Route
                path="/"
                element={
                    <Navigate
                        to={isAuthenticated ? '/students' : '/login'}
                        replace
                    />
                }
            />

            {/* Public routes */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* Protected route */}
            <Route
                path="/students"
                element={
                    <ProtectedRoute>
                        <Students />
                    </ProtectedRoute>
                }
            />

            {/* Unknown routes */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

export default App;
