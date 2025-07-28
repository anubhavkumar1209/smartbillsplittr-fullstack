import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Avatar,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemIcon, ListItemText, Switch,
  Divider, Alert
} from '@mui/material';
import {
  Edit, Settings, Notifications, Security,
  Language, Info, Save, DarkMode, LightMode
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';

const Profile = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { profile, settings, updateProfile, updateSettings } = useProfile();
  
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  // Update editForm when profile changes (from context)
  React.useEffect(() => {
    setEditForm(profile);
  }, [profile]);

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setOpenEditDialog(false);
    console.log('✅ Profile saved:', editForm);
  };

  const handleSettingChange = (setting) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    updateSettings(newSettings);
    console.log('✅ Setting changed:', setting, newSettings[setting]);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your profile and application settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {profile.fullName.charAt(0)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {profile.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  @{profile.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {profile.email}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setOpenEditDialog(true)}
                  fullWidth
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Personal Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {profile.fullName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Username
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {profile.username}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {profile.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {profile.phone}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        UPI ID
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {profile.upiId}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Settings */}
        <Grid item xs={12}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Receive notifications for new expenses and settlements"
                    />
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={() => handleSettingChange('pushNotifications')}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive email updates about your expenses"
                    />
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={() => handleSettingChange('emailNotifications')}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      {isDarkMode ? <LightMode /> : <DarkMode />}
                    </ListItemIcon>
                    <ListItemText
                      primary="Dark Mode"
                      secondary={`Currently using ${isDarkMode ? 'dark' : 'light'} theme`}
                    />
                    <Switch
                      checked={isDarkMode}
                      onChange={toggleDarkMode}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText
                      primary="Language"
                      secondary="Choose your preferred language"
                    />
                    <Typography variant="body2" color="primary">
                      {settings.language}
                    </Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Privacy & Security"
                      secondary="Manage your privacy settings"
                    />
                    <Button size="small">Manage</Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* App Info */}
        <Grid item xs={12}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Info color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    About SmartBillSplittr
                  </Typography>
                </Box>
                <Alert severity="success">
                  ✅ Profile data is now automatically saved and persists after reload!
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            fullWidth
            variant="outlined"
            value={editForm.fullName}
            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={editForm.username}
            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            variant="outlined"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="UPI ID"
            fullWidth
            variant="outlined"
            value={editForm.upiId}
            onChange={(e) => setEditForm({ ...editForm, upiId: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveProfile} 
            variant="contained"
            startIcon={<Save />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
