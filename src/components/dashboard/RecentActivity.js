import React from 'react';
import {
  Card, CardContent, Typography, List, ListItem,
  ListItemAvatar, ListItemText, Avatar, Chip
} from '@mui/material';
import { Person, Groups, AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'expense',
      message: 'You added "Dinner" to Roommates',
      time: '2 min ago',
      icon: <AttachMoney />
    },
    {
      id: 2,
      type: 'group',
      message: 'John joined "Weekend Trip"',
      time: '1 hour ago',
      icon: <Person />
    },
    {
      id: 3,
      type: 'settlement',
      message: 'Sarah settled with you',
      time: '3 hours ago',
      icon: <Groups />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Recent Activity
          </Typography>
          
          <List>
            {activities.map((activity) => (
              <ListItem key={activity.id} sx={{ pl: 0 }}>
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'secondary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    {activity.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.message}
                  secondary={activity.time}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivity;
