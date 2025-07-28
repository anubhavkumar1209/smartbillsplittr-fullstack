import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Avatar,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Select, MenuItem, FormControl, InputLabel, Chip, TableContainer,
  Table, TableHead, TableRow, TableCell, TableBody, Paper,
  Alert, IconButton
} from '@mui/material';
import {
  Add, Receipt, Group, AttachMoney, Delete, Edit
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';

const Expenses = () => {
  const { addNotification } = useNotification();
  const [expenses, setExpenses] = useState([]);
  const [groups] = useState([
    { id: 1, name: 'Sample Group' }
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    groupId: '',
    category: 'FOOD'
  });

  const handleCreateExpense = async () => {
    try {
      const mockExpense = {
        id: Date.now(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        groupName: groups.find(g => g.id === newExpense.groupId)?.name || 'Unknown',
        paidBy: 'You',
        createdAt: new Date().toISOString(),
        splits: []
      };
      setExpenses([mockExpense, ...expenses]);
      setOpenDialog(false);
      setNewExpense({ description: '', amount: '', groupId: '', category: 'FOOD' });
      
      addNotification({
        type: 'EXPENSE_ADDED',
        title: 'Expense Added',
        message: `You added "${newExpense.description}" expense of ₹${newExpense.amount}`,
        groupName: groups.find(g => g.id === newExpense.groupId)?.name
      });
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleDeleteExpense = (expenseId) => {
    const expense = expenses.find(e => e.id === expenseId);
    setExpenses(expenses.filter(e => e.id !== expenseId));
    
    addNotification({
      type: 'EXPENSE_DELETED',
      title: 'Expense Deleted',
      message: `"${expense.description}" expense was deleted`,
      groupName: expense.groupName
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      FOOD: '#4caf50',
      TRANSPORTATION: '#2196f3',
      ENTERTAINMENT: '#ff9800',
      SHOPPING: '#9c27b0',
      UTILITIES: '#607d8b',
      OTHER: '#795548'
    };
    return colors[category] || '#757575';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Expenses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage all your shared expenses
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
          Add Expense
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AttachMoney />
                </Avatar>
                <div>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Expenses
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <Receipt />
                </Avatar>
                <div>
                  <Typography variant="h6" fontWeight="bold">
                    {expenses.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Transactions
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Group />
                </Avatar>
                <div>
                  <Typography variant="h6" fontWeight="bold">
                    {groups.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Groups
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Expenses Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Recent Expenses
          </Typography>
          {expenses.length === 0 ? (
            <Alert severity="info">
              No expenses added yet. Add your first expense to get started!
            </Alert>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Group</TableCell>
                    <TableCell>Paid By</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: getCategoryColor(expense.category), width: 32, height: 32 }}>
                            <Receipt fontSize="small" />
                          </Avatar>
                          <div>
                            <Typography variant="body2" fontWeight="500">
                              {expense.description}
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold" color="primary">
                          ₹{expense.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={expense.category}
                          size="small"
                          sx={{ 
                            bgcolor: getCategoryColor(expense.category),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>{expense.groupName}</TableCell>
                      <TableCell>{expense.paidBy}</TableCell>
                      <TableCell>{formatDate(expense.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="error" onClick={() => handleDeleteExpense(expense.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Amount (₹)"
            type="number"
            fullWidth
            variant="outlined"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Group</InputLabel>
            <Select
              value={newExpense.groupId}
              label="Group"
              onChange={(e) => setNewExpense({ ...newExpense, groupId: e.target.value })}
            >
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={newExpense.category}
              label="Category"
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            >
              <MenuItem value="FOOD">Food</MenuItem>
              <MenuItem value="TRANSPORTATION">Transportation</MenuItem>
              <MenuItem value="ENTERTAINMENT">Entertainment</MenuItem>
              <MenuItem value="SHOPPING">Shopping</MenuItem>
              <MenuItem value="UTILITIES">Utilities</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateExpense} 
            variant="contained"
            disabled={!newExpense.description.trim() || !newExpense.amount || !newExpense.groupId}
          >
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Expenses;
