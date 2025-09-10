import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from '../features/auth/Login';
import MainLayout from '../layouts/MainLayout';
import Home from '../features/home/Home';
import Dashboard from '../features/exception/Dashboard';
import Exception from '../features/exception/Exception';
import Details from '../features/exception/Details';

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
      <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
        <Route path="home" element={<Home />} />
        <Route path="exception/dashboard" element={<Dashboard />} />
        <Route path="exception" element={<Exception />} />
        <Route path="exception/details/:id" element={<Details />} />
        <Route path="" element={<Navigate to="/home" />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;