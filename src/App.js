import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { GroupProvider } from './contexts/GroupContext';
import { ProfileProvider } from './contexts/ProfileContext'; // Add ProfileProvider import
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Groups from './components/groups/Groups';
import GroupDetails from './components/groups/GroupDetails';
import Expenses from './components/expenses/Expenses';
import Settlements from './components/settlements/Settlements';
import Notifications from './components/notifications/Notifications';
import Profile from './components/profile/Profile';
import Payment from './components/payment/Payment';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <GroupProvider>
            <ProfileProvider> {/* Add ProfileProvider wrapper */}
              <Router>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/app" element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="groups" element={<Groups />} />
                    <Route path="groups/:id" element={<GroupDetails />} />
                    <Route path="expenses" element={<Expenses />} />
                    <Route path="settlements" element={<Settlements />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="payment" element={<Payment />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </ProfileProvider>
          </GroupProvider>
        </NotificationProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
