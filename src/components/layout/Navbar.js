import React from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Badge, Avatar
} from '@mui/material';
import { Notifications, AccountCircle } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Welcome back!
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit">
            <Avatar sx={{ width: 32, height: 32 }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
