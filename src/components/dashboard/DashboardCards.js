import React from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { TrendingUp, AccountBalance, Groups, Receipt } from '@mui/icons-material';
import { motion } from 'framer-motion';

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Expenses',
      value: `$${stats.totalExpenses.toFixed(2)}`,
      icon: <Receipt />,
      color: '#667eea',
      change: '+12%'
    },
    {
      title: 'Active Groups',
      value: stats.totalGroups,
      icon: <Groups />,
      color: '#f093fb',
      change: '+2'
    },
    {
      title: 'Pending Settlements',
      value: stats.pendingSettlements,
      icon: <AccountBalance />,
      color: '#4caf50',
      change: '-1'
    },
    {
      title: 'Monthly Spending',
      value: `$${stats.monthlySpending.toFixed(2)}`,
      icon: <TrendingUp />,
      color: '#ff9800',
      change: '+8%'
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${card.color}20 0%, ${card.color}10 100%)`,
                border: `1px solid ${card.color}30`,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${card.color}40`
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {card.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: card.change.startsWith('+') ? 'success.main' : 'error.main',
                        mt: 1
                      }}
                    >
                      {card.change} from last month
                    </Typography>
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: card.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
