import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import AdminLayout from "layouts/Admin.js";
import Operator from "layouts/Operator";
import AuthLayout from "layouts/Auth.js";
const useTokenRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.Role === 'Operator') {
                    navigate('/operator/index', { replace: true });
                } else if (decoded.Role === 'Admin') {
                    navigate('/admin/index', { replace: true });
                }
            } catch (error) {
                console.error('Invalid token:', error);
                navigate('/auth/login', { replace: true });
            }
        } else {
            navigate('/auth/login', { replace: true });
        }
    }, []);
};
const App = () => {
    useTokenRedirect();
    return (
        <Routes>
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/operator/*" element={<Operator />} />
            <Route path="/auth/*" element={<AuthLayout />} />
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
    )
}

export default App;