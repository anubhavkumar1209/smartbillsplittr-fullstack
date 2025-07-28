import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, List, ListItem,
  ListItemText, ListItemAvatar, Avatar, Chip, Button,
  Badge, IconButton, Alert
} from '@mui/material';
import {
  Notifications as NotificationIcon, Groups, Receipt,
  AccountBalance, Person, CheckCircle, Delete,
  MarkEmailRead
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';

const Notifications = () => {
  const { notifications, markAsRead, deleteNotification, markAllAsRead, getUnreadCount } = useNotification();
  const [filter, setFilter] = useState('ALL');

  // Auto mark notifications as read when user views them
  useEffect(() => {
    console.log('📖 User viewing notifications page');
    const timer = setTimeout(() => {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      if (unreadNotifications.length > 0) {
        console.log('📖 Auto-marking', unreadNotifications.length, 'notifications as read');
        unreadNotifications.forEach(notif => {
          markAsRead(notif.id);
        });
      }
    }, 1500); // Mark as read after 1.5 seconds

    return () => clearTimeout(timer);
  }, [notifications, markAsRead]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      'EXPENSE_ADDED': <Receipt />,
      'EXPENSE_DELETED': <Receipt />,
      'GROUP_CREATED': <Groups />,
      'GROUP_DELETED': <Groups />,
      'MEMBER_ADDED': <Person />,
      'MEMBER_REMOVED': <Person />,
      'SETTLEMENT_CREATED': <AccountBalance />,
      'SETTLEMENT_COMPLETED': <CheckCircle />
    };
    return iconMap[type] || <NotificationIcon />;
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      'EXPENSE_ADDED': 'primary.main',
      'EXPENSE_DELETED': 'error.main',
      'GROUP_CREATED': 'secondary.main',
      'GROUP_DELETED': 'error.main',
      'MEMBER_ADDED': 'success.main',
      'MEMBER_REMOVED': 'warning.main',
      'SETTLEMENT_CREATED': 'warning.main',
      'SETTLEMENT_COMPLETED': 'success.main'
    };
    return colorMap[type] || 'grey.500';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => 
    filter === 'ALL' || 
    (filter === 'UNREAD' && !notification.isRead) ||
    (filter === 'READ' && notification.isRead)
  );

  const unreadCount = getUnreadCount();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Notifications
            {unreadCount > 0 && (
              <Badge 
                badgeContent={unreadCount} 
                color="error" 
                sx={{ ml: 2 }}
              />
            )}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up! No new notifications.'}
          </Typography>
        </div>
        <Button
          variant="outlined"
          startIcon={<MarkEmailRead />}
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark All Read
        </Button>
      </Box>

      {/* Filter Chips */}
      <Box display="flex" gap={1} mb={3}>
        {['ALL', 'UNREAD', 'read'].map((filterType) => (
          <Chip
            key={filterType}
            label={filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            variant={filter === filterType ? 'filled' : 'outlined'}
            color={filter === filterType ? 'primary' : 'default'}
            onClick={() => setFilter(filterType)}
            sx={{
              '&:hover': { transform: 'scale(1.05)' }
            }}
          />
        ))}
      </Box>

      {/* Notifications List */}
      <Card>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <Alert severity="info">
              {filter === 'ALL' ? 'No notifications yet. Start using the app to get notifications!' :
               filter === 'UNREAD' ? 'All notifications are read!' :
               'No read notifications.'}
            </Alert>
          ) : (
            <List>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListItem
                    divider={index < filteredNotifications.length - 1}
                    sx={{
                      bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1,
                      border: notification.isRead ? 'none' : '1px solid',
                      borderColor: notification.isRead ? 'transparent' : 'primary.light'
                    }}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        color="error"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getNotificationColor(notification.type) }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1" fontWeight="500">
                            {notification.title}
                          </Typography>
                          {!notification.isRead && (
                            <Badge color="error" variant="dot" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(notification.createdAt)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Notifications;
