import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Avatar,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Chip, IconButton, List, ListItem, ListItemText, ListItemAvatar,
  Alert, Fab, Menu, MenuItem
} from '@mui/material';
import {
  Add, Groups as GroupsIcon, Person, Edit, Delete, Visibility,
  PersonAdd, MoreVert
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { useGroups } from '../../contexts/GroupContext';

const Groups = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { groups, addGroup, updateGroup, deleteGroup } = useGroups();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: ''
  });
  const [newMember, setNewMember] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCreateGroup = async () => {
    try {
      const createdGroup = addGroup({
        name: newGroup.name,
        description: newGroup.description,
        members: ['You']
      });
      
      setOpenDialog(false);
      setNewGroup({ name: '', description: '' });
      
      // ✅ Enhanced notification with immediate count update
      addNotification({
        type: 'GROUP_CREATED',
        title: 'Group Created! 🎉',
        message: `Successfully created "${newGroup.name}" group`,
        groupName: newGroup.name
      });

      console.log('✅ Group created and notification added');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleAddMember = () => {
    if (newMember.trim() && selectedGroup) {
      const updatedMembers = [...selectedGroup.members, newMember.trim()];
      
      updateGroup(selectedGroup.id, {
        members: updatedMembers
      });
      
      setNewMember('');
      setOpenMemberDialog(false);
      
      // ✅ Immediate notification with real-time count update
      addNotification({
        type: 'MEMBER_ADDED',
        title: 'Member Added! 👥',
        message: `${newMember} joined "${selectedGroup.name}"`,
        groupName: selectedGroup.name
      });

      console.log('✅ Member added and notification triggered');
    }
  };

  const handleRemoveMember = (groupId, memberName) => {
    if (memberName === 'You') return;
    
    const group = groups.find(g => g.id === groupId);
    const updatedMembers = group.members.filter(m => m !== memberName);
    
    updateGroup(groupId, {
      members: updatedMembers
    });
    
    // ✅ Immediate notification with count update
    addNotification({
      type: 'MEMBER_REMOVED',
      title: 'Member Removed! 👋',
      message: `${memberName} left "${group.name}"`,
      groupName: group.name
    });

    console.log('✅ Member removed and notification triggered');
  };

  const handleDeleteGroup = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    deleteGroup(groupId);
    
    // ✅ Immediate notification with count update
    addNotification({
      type: 'GROUP_DELETED',
      title: 'Group Deleted! 🗑️',
      message: `"${group.name}" has been permanently deleted`,
      groupName: group.name
    });

    console.log('✅ Group deleted and notification triggered');
  };

  const handleExpenseClick = (group) => {
    navigate(`/app/groups/${group.id}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Groups
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your expense groups and members
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
            '&:hover': { 
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
            }
          }}
        >
          Create Group
        </Button>
      </Box>

      {groups.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          No groups created yet. Create your first group to get started!
        </Alert>
      ) : null}

      <Grid container spacing={3}>
        {groups.map((group, index) => (
          <Grid item xs={12} md={6} lg={4} key={group.id}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(255, 107, 107, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 48,
                        height: 48
                      }}
                    >
                      <GroupsIcon />
                    </Avatar>
                    <Box>
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnchorEl(e.currentTarget);
                          setSelectedGroup(group);
                        }}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {group.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {group.description}
                  </Typography>

                  <Box 
                    mb={2} 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        '& .expense-amount': {
                          transform: 'scale(1.05)'
                        }
                      }
                    }}
                    onClick={() => handleExpenseClick(group)}
                  >
                    <Typography 
                      variant="h5" 
                      color="primary" 
                      fontWeight="bold"
                      className="expense-amount"
                      sx={{ transition: 'transform 0.2s ease' }}
                    >
                      ₹{(group.totalExpenses || 0).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total expenses (Click to view details)
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2">
                      {(group.members || []).length} members
                    </Typography>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGroup(group);
                        setOpenMemberDialog(true);
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white'
                        }
                      }}
                    >
                      <PersonAdd fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {(group.members || []).slice(0, 3).map((member, idx) => (
                      <Chip 
                        key={idx}
                        label={member}
                        size="small"
                        variant="outlined"
                        onDelete={member !== 'You' ? () => handleRemoveMember(group.id, member) : undefined}
                        sx={{
                          '&:hover': {
                            backgroundColor: member !== 'You' ? 'error.light' : 'transparent'
                          }
                        }}
                      />
                    ))}
                    {(group.members || []).length > 3 && (
                      <Chip 
                        label={`+${(group.members || []).length - 3} more`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Group Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            borderRadius: 2
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            navigate(`/app/groups/${selectedGroup?.id}`);
            setAnchorEl(null);
          }}
          sx={{
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white'
            }
          }}
        >
          <Visibility sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem 
          onClick={() => setAnchorEl(null)}
          sx={{
            '&:hover': {
              backgroundColor: 'warning.light',
              color: 'white'
            }
          }}
        >
          <Edit sx={{ mr: 1 }} /> Edit Group
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedGroup) {
              handleDeleteGroup(selectedGroup.id);
            }
            setAnchorEl(null);
          }}
          sx={{ 
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'white'
            }
          }}
        >
          <Delete sx={{ mr: 1 }} /> Delete Group
        </MenuItem>
      </Menu>

      {/* Create Group Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Create New Group
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            fullWidth
            variant="outlined"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            sx={{ mb: 2 }}
            placeholder="Enter a catchy group name"
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newGroup.description}
            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
            placeholder="What's this group for? (optional)"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGroup} 
            variant="contained"
            disabled={!newGroup.name.trim()}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
              }
            }}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog 
        open={openMemberDialog} 
        onClose={() => setOpenMemberDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Add Member to {selectedGroup?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Add friends and family to split expenses together
          </Alert>
          <TextField
            autoFocus
            margin="dense"
            label="Member Name"
            fullWidth
            variant="outlined"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Enter member's name"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenMemberDialog(false)}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddMember} 
            variant="contained"
            disabled={!newMember.trim()}
            sx={{
              background: 'linear-gradient(45deg, #4ECDC4 30%, #44A08D 90%)',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)'
              }
            }}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Groups;
