import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Box, Typography, Divider, Badge, IconButton
} from '@mui/material';
import {
  Dashboard, Groups, Receipt, AccountBalance,
  Notifications, Person, Payment, ExitToApp, DarkMode, LightMode
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';

const drawerWidth = 280;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { getUnreadCount } = useNotification();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const unreadCount = getUnreadCount();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/app/dashboard' },
    { text: 'Groups', icon: <Groups />, path: '/app/groups' },
    { text: 'Expenses', icon: <Receipt />, path: '/app/expenses' },
    { text: 'Settlements', icon: <AccountBalance />, path: '/app/settlements' },
    { 
      text: 'Notifications', 
      icon: unreadCount > 0 ? (
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      ) : <Notifications />, 
      path: '/app/notifications'
    },
    { text: 'Payment', icon: <Payment />, path: '/app/payment' },
    { text: 'Profile', icon: <Person />, path: '/app/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #FF6B6B 0%, #4ECDC4 100%)',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight="bold">
          Smart<span style={{ color: '#f093fb' }}>Bill</span>Splittr
        </Typography>
        <IconButton onClick={toggleDarkMode} sx={{ color: 'white' }}>
          {isDarkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 2,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
              {/* ❌ ABSOLUTELY NO TEXT HERE - REMOVED EVERYTHING */}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 2, my: 1, borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
