import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Avatar,
  List, ListItem, ListItemText, ListItemAvatar,
  Chip, Button, Alert
} from '@mui/material';
import {
  Groups, Receipt, AccountBalance, TrendingUp,
  TrendingDown, Person, AttachMoney
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { useGroups } from '../../contexts/GroupContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { notifications } = useNotification(); // Remove getUnreadCount if not needed
  const { groups } = useGroups();

  // Mock data for dashboard stats
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalGroups: 0,
    pendingSettlements: 0,
    thisMonthExpenses: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Calculate stats from groups
    const totalExpenses = groups.reduce((sum, group) => sum + (group.totalExpenses || 0), 0);
    const totalGroups = groups.length;
    
    setStats({
      totalExpenses,
      totalGroups,
      pendingSettlements: 0,
      thisMonthExpenses: totalExpenses * 0.7 // Mock calculation
    });

    // Set recent activity from recent notifications
    setRecentActivity(notifications.slice(0, 5));
  }, [groups, notifications]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      'EXPENSE_ADDED': <Receipt />,
      'GROUP_CREATED': <Groups />,
      'MEMBER_ADDED': <Person />,
      'SETTLEMENT_COMPLETED': <AccountBalance />
    };
    return iconMap[type] || <Receipt />;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's your expense overview
          </Typography>
        </div>
        {/* ❌ REMOVED: Extra notification bell icon from here */}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <AttachMoney />
                  </Avatar>
                  <div>
                    <Typography variant="h6" fontWeight="bold">
                      ₹{stats.totalExpenses.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Expenses
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <Groups />
                  </Avatar>
                  <div>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.totalGroups}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Groups
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <TrendingUp />
                  </Avatar>
                  <div>
                    <Typography variant="h6" fontWeight="bold">
                      ₹{stats.thisMonthExpenses.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This Month
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <AccountBalance />
                  </Avatar>
                  <div>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.pendingSettlements}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Settlements
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Recent Activity & Quick Actions */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Recent Activity
                </Typography>
                
                {recentActivity.length === 0 ? (
                  <Alert severity="info">
                    No recent activity. Start by creating a group or adding expenses!
                  </Alert>
                ) : (
                  <List>
                    {recentActivity.map((activity, index) => (
                      <ListItem key={activity.id} divider={index < recentActivity.length - 1}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={activity.message}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Quick Actions
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<Groups />}
                    onClick={() => navigate('/app/groups')}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Create Group
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Receipt />}
                    onClick={() => navigate('/app/expenses')}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Add Expense
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<AccountBalance />}
                    onClick={() => navigate('/app/settlements')}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    View Settlements
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
