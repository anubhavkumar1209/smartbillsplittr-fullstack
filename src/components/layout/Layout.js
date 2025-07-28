import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
