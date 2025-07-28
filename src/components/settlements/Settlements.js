import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Avatar,
  List, ListItem, ListItemText, ListItemAvatar, Chip,
  Alert, Divider, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  AccountBalance, TrendingUp, TrendingDown, CheckCircle,
  Payment, Person, Add
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';

const Settlements = () => {
  const { addNotification } = useNotification();
  const [settlements, setSettlements] = useState([]);
  const [balances, setBalances] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newSettlement, setNewSettlement] = useState({
    type: 'owe', // 'owe' or 'owed'
    person: '',
    amount: '',
    description: ''
  });

  const handleAddSettlement = () => {
    const settlement = {
      id: Date.now(),
      from: newSettlement.type === 'owe' ? 'You' : newSettlement.person,
      to: newSettlement.type === 'owe' ? newSettlement.person : 'You',
      amount: parseFloat(newSettlement.amount),
      description: newSettlement.description,
      status: 'PENDING',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setSettlements([...settlements, settlement]);

    // Update balances
    const existingBalance = balances.find(b => b.person === newSettlement.person);
    if (existingBalance) {
      const updatedBalances = balances.map(b => 
        b.person === newSettlement.person 
          ? { 
              ...b, 
              balance: newSettlement.type === 'owe' 
                ? b.balance + parseFloat(newSettlement.amount)
                : b.balance - parseFloat(newSettlement.amount),
              type: newSettlement.type === 'owe' ? 'owes' : 'owed'
            }
          : b
      );
      setBalances(updatedBalances);
    } else {
      setBalances([...balances, {
        person: newSettlement.person,
        balance: parseFloat(newSettlement.amount),
        type: newSettlement.type === 'owe' ? 'owes' : 'owed'
      }]);
    }

    setOpenDialog(false);
    setNewSettlement({ type: 'owe', person: '', amount: '', description: '' });

    addNotification({
      type: 'SETTLEMENT_CREATED',
      title: 'Settlement Added',
      message: `Settlement of ₹${newSettlement.amount} ${newSettlement.type === 'owe' ? 'to' : 'from'} ${newSettlement.person}`,
    });
  };

  const handleSettlePayment = (settlementId) => {
    const settlement = settlements.find(s => s.id === settlementId);
    setSettlements(settlements.map(s => 
      s.id === settlementId 
        ? { ...s, status: 'COMPLETED', settledDate: new Date().toISOString().split('T')[0] }
        : s
    ));

    addNotification({
      type: 'SETTLEMENT_COMPLETED',
      title: 'Payment Settled',
      message: `₹${settlement.amount} payment was completed`,
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const totalOwed = balances.filter(b => b.type === 'owed').reduce((sum, b) => sum + Math.abs(b.balance), 0);
  const totalOwes = balances.filter(b => b.type === 'owes').reduce((sum, b) => sum + b.balance, 0);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Settlements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track payments and settle balances with friends
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            '&:hover': { transform: 'translateY(-2px)' }
          }}
        >
          Add Settlement
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <TrendingUp />
                  </Avatar>
                  <div>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      ₹{totalOwed.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You are owed
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'error.main' }}>
                    <TrendingDown />
                  </Avatar>
                  <div>
                    <Typography variant="h6" fontWeight="bold" color="error.main">
                      ₹{totalOwes.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You owe
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <AccountBalance />
                  </Avatar>
                  <div>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      ₹{Math.abs(totalOwed - totalOwes).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Net Balance
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Settlements */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Pending Settlements
                </Typography>
                {settlements.filter(s => s.status === 'PENDING').length === 0 ? (
                  <Alert severity="info">
                    No pending settlements. All caught up!
                  </Alert>
                ) : (
                  <List>
                    {settlements.filter(s => s.status === 'PENDING').map((settlement) => (
                      <ListItem key={settlement.id} divider>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'warning.main' }}>
                            <Payment />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body1" fontWeight="500">
                                {settlement.from} → {settlement.to}
                              </Typography>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                ₹{settlement.amount.toFixed(2)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {settlement.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Due: {settlement.dueDate}
                              </Typography>
                            </Box>
                          }
                        />
                        <Box ml={2}>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => handleSettlePayment(settlement.id)}
                          >
                            Mark Paid
                          </Button>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Completed Settlements */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Settlement History
                </Typography>
                {settlements.filter(s => s.status === 'COMPLETED').length === 0 ? (
                  <Alert severity="info">
                    No settlement history yet.
                  </Alert>
                ) : (
                  <List>
                    {settlements.filter(s => s.status === 'COMPLETED').map((settlement) => (
                      <ListItem key={settlement.id} divider>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <CheckCircle />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body1" fontWeight="500">
                                {settlement.from} → {settlement.to}
                              </Typography>
                              <Typography variant="h6" color="success.main" fontWeight="bold">
                                ₹{settlement.amount.toFixed(2)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {settlement.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Settled: {settlement.settledDate}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip 
                          label="Completed"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Add Settlement Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Settlement</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Settlement Type</InputLabel>
            <Select
              value={newSettlement.type}
              label="Settlement Type"
              onChange={(e) => setNewSettlement({ ...newSettlement, type: e.target.value })}
            >
              <MenuItem value="owe">I owe someone</MenuItem>
              <MenuItem value="owed">Someone owes me</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Person Name"
            fullWidth
            variant="outlined"
            value={newSettlement.person}
            onChange={(e) => setNewSettlement({ ...newSettlement, person: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Amount (₹)"
            type="number"
            fullWidth
            variant="outlined"
            value={newSettlement.amount}
            onChange={(e) => setNewSettlement({ ...newSettlement, amount: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newSettlement.description}
            onChange={(e) => setNewSettlement({ ...newSettlement, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddSettlement} 
            variant="contained"
            disabled={!newSettlement.person.trim() || !newSettlement.amount || !newSettlement.description.trim()}
          >
            Add Settlement
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settlements;
