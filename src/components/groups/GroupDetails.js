import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Grid, Avatar,
  List, ListItem, ListItemText, ListItemAvatar, Chip,
  Alert, Divider, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, IconButton, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack, Groups as GroupsIcon, Person, Add, Delete,
  Receipt, AccountBalance, Edit, MoreVert, AttachMoney
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';
import { useGroups } from '../../contexts/GroupContext';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { getGroupById, updateGroup } = useGroups();
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'FOOD'
  });

  useEffect(() => {
    const loadGroupData = () => {
      try {
        setLoading(true);
        const foundGroup = getGroupById(id);
        
        if (foundGroup) {
          console.log('Found group:', foundGroup);
          setGroup({
            ...foundGroup,
            members: Array.isArray(foundGroup.members) 
              ? foundGroup.members.map((member, index) => ({
                  id: index + 1,
                  name: typeof member === 'string' ? member : member.name,
                  isAdmin: (typeof member === 'string' ? member : member.name) === 'You'
                }))
              : [{ id: 1, name: 'You', isAdmin: true }],
            expenses: foundGroup.expenses || [],
            settlements: foundGroup.settlements || []
          });
        } else {
          console.log('Group not found, redirecting...');
          navigate('/app/groups');
        }
      } catch (error) {
        console.error('Error loading group:', error);
        navigate('/app/groups');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadGroupData();
    }
  }, [id, getGroupById, navigate]);

  const syncGroupToContext = (updatedGroup) => {
    updateGroup(updatedGroup.id, {
      name: updatedGroup.name,
      description: updatedGroup.description,
      members: updatedGroup.members.map(m => m.name),
      totalExpenses: updatedGroup.totalExpenses,
      expenses: updatedGroup.expenses || []
    });
  };

  const calculateMemberBalances = () => {
    const balances = {};
    
    if (!group || !group.members) return balances;
    
    group.members.forEach(member => {
      balances[member.name] = { owes: 0, owed: 0, net: 0 };
    });

    if (group.expenses && group.expenses.length > 0) {
      group.expenses.forEach(expense => {
        const totalAmount = expense.amount;
        const perPersonAmount = totalAmount / expense.splits.length;
        
        if (balances[expense.paidBy]) {
          balances[expense.paidBy].owed += totalAmount - perPersonAmount;
        }
        
        expense.splits.forEach(split => {
          if (split.userName !== expense.paidBy && balances[split.userName]) {
            balances[split.userName].owes += perPersonAmount;
          }
        });
      });

      Object.keys(balances).forEach(member => {
        balances[member].net = balances[member].owed - balances[member].owes;
      });
    }

    return balances;
  };

  const memberBalances = calculateMemberBalances();

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      alert('Please enter member name');
      return;
    }

    const newMember = {
      id: Date.now(),
      name: newMemberName.trim(),
      isAdmin: false
    };

    const updatedGroup = {
      ...group,
      members: [...group.members, newMember]
    };

    setGroup(updatedGroup);
    syncGroupToContext(updatedGroup);

    setOpenAddMemberDialog(false);
    setNewMemberName('');

    // ✅ Enhanced notification
    addNotification({
      type: 'MEMBER_ADDED',
      title: 'New Member Added! 👋',
      message: `${newMemberName.trim()} joined "${group.name}" group`,
      groupName: group.name
    });
  };

  const handleRemoveMember = (memberId, memberName) => {
    if (memberName === 'You') {
      alert("You can't remove yourself from the group");
      return;
    }

    const updatedGroup = {
      ...group,
      members: group.members.filter(m => m.id !== memberId)
    };

    setGroup(updatedGroup);
    syncGroupToContext(updatedGroup);

    // ✅ Enhanced notification
    addNotification({
      type: 'MEMBER_REMOVED',
      title: 'Member Removed! 👋',
      message: `${memberName} left "${group.name}" group`,
      groupName: group.name
    });
  };

  const handleAddExpense = () => {
    if (!newExpense.description.trim() || !newExpense.amount) {
      alert('Please fill all fields');
      return;
    }

    if (group.members.length === 0) {
      alert('Add members to the group first');
      return;
    }

    const expense = {
      id: Date.now(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      paidBy: 'You',
      date: new Date().toISOString().split('T')[0],
      splits: group.members.map(member => ({
        userId: member.id,
        userName: member.name,
        amount: parseFloat(newExpense.amount) / group.members.length
      }))
    };

    const updatedGroup = {
      ...group,
      expenses: [expense, ...(group.expenses || [])],
      totalExpenses: (group.totalExpenses || 0) + parseFloat(newExpense.amount)
    };

    setGroup(updatedGroup);
    syncGroupToContext(updatedGroup);

    setOpenAddExpenseDialog(false);
    setNewExpense({ description: '', amount: '', category: 'FOOD' });

    // ✅ Enhanced notification with more details
    addNotification({
      type: 'EXPENSE_ADDED',
      title: 'Expense Added! 💰',
      message: `₹${newExpense.amount} expense "${newExpense.description}" added to ${group.name}`,
      groupName: group.name
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!group) {
    return (
      <Box>
        <Alert severity="error">
          Group not found. Please go back to groups list.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <IconButton onClick={() => navigate('/app/groups')}>
          <ArrowBack />
        </IconButton>
        <div style={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {group.name || 'Untitled Group'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {group.description || 'No description added yet'}
          </Typography>
        </div>
        <Button
          variant="outlined"
          startIcon={<Edit />}
        >
          Edit Group
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <AttachMoney />
                  </Avatar>
                  <div>
                    <Typography variant="h6" fontWeight="bold">
                      ₹{(group.totalExpenses || 0).toFixed(2)}
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
        <Grid item xs={12} sm={4}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <Person />
                  </Avatar>
                  <div>
                    <Typography variant="h6" fontWeight="bold">
                      {group.members ? group.members.length : 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Members
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <Receipt />
                  </Avatar>
                  <div>
                    <Typography variant="h6" fontWeight="bold">
                      {group.expenses ? group.expenses.length : 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transactions
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Members" />
          <Tab label="Expenses" />
          <Tab label="Balances" />
          <Tab label="Settlements" />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Group Members ({group.members ? group.members.length : 0})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenAddMemberDialog(true)}
                >
                  Add Member
                </Button>
              </Box>
              
              {!group.members || group.members.length === 0 ? (
                <Alert severity="info">
                  No members in this group yet. Add some members to get started!
                </Alert>
              ) : (
                <List>
                  {group.members.map((member, index) => (
                    <ListItem 
                      key={member.id}
                      divider={index < group.members.length - 1}
                      secondaryAction={
                        member.name !== 'You' && (
                          <IconButton 
                            edge="end" 
                            color="error"
                            onClick={() => handleRemoveMember(member.id, member.name)}
                          >
                            <Delete />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: member.isAdmin ? 'primary.main' : 'grey.500' }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1" fontWeight="500">
                              {member.name}
                            </Typography>
                            {member.isAdmin && (
                              <Chip label="Admin" size="small" color="primary" />
                            )}
                          </Box>
                        }
                        secondary={member.isAdmin ? 'Group Administrator' : 'Member'}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 1 && (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Group Expenses ({group.expenses ? group.expenses.length : 0})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenAddExpenseDialog(true)}
                  disabled={!group.members || group.members.length === 0}
                >
                  Add Expense
                </Button>
              </Box>

              {!group.expenses || group.expenses.length === 0 ? (
                <Alert severity="info">
                  No expenses added yet. {!group.members || group.members.length === 0 ? 'Add members first, then' : 'Add your first expense to get started!'}
                </Alert>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Paid By</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.expenses.map((expense) => (
                        <TableRow key={expense.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {expense.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6" color="primary" fontWeight="bold">
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
                          <TableCell>{expense.paidBy}</TableCell>
                          <TableCell>{expense.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 2 && (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Member Balances
              </Typography>
              
              {!group.expenses || group.expenses.length === 0 ? (
                <Alert severity="info">
                  No expenses to calculate balances. Add some expenses first!
                </Alert>
              ) : (
                <List>
                  {Object.entries(memberBalances).map(([memberName, balance], index) => (
                    <ListItem key={index} divider={index < Object.keys(memberBalances).length - 1}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: balance.net > 0 ? 'success.main' : balance.net < 0 ? 'error.main' : 'grey.500' 
                        }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={memberName}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Owes: ₹{balance.owes.toFixed(2)} | Owed: ₹{balance.owed.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box textAlign="right">
                        <Typography 
                          variant="h6" 
                          fontWeight="bold"
                          color={balance.net > 0 ? 'success.main' : balance.net < 0 ? 'error.main' : 'text.primary'}
                        >
                          {balance.net > 0 ? '+' : balance.net < 0 ? '-' : ''}₹{Math.abs(balance.net).toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {balance.net > 0 ? 'Gets back' : balance.net < 0 ? 'Owes' : 'Settled'}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 3 && (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Pending Settlements
              </Typography>
              
              <Alert severity="info">
                No pending settlements. All expenses are settled!
              </Alert>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Add Member Dialog */}
      <Dialog open={openAddMemberDialog} onClose={() => setOpenAddMemberDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Member Name"
            fullWidth
            variant="outlined"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Enter member name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddMemberDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddMember} 
            variant="contained"
            disabled={!newMemberName.trim()}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog open={openAddExpenseDialog} onClose={() => setOpenAddExpenseDialog(false)} maxWidth="sm" fullWidth>
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
          <TextField
            select
            margin="dense"
            label="Category"
            fullWidth
            variant="outlined"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            SelectProps={{ native: true }}
          >
            <option value="FOOD">Food</option>
            <option value="TRANSPORTATION">Transportation</option>
            <option value="ENTERTAINMENT">Entertainment</option>
            <option value="SHOPPING">Shopping</option>
            <option value="UTILITIES">Utilities</option>
            <option value="OTHER">Other</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddExpenseDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddExpense} 
            variant="contained"
            disabled={!newExpense.description.trim() || !newExpense.amount}
          >
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupDetails;
