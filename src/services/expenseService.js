import { authService } from './authService';

export const expenseService = {
  getAllExpenses: () => authService.api.get('/expenses'),
  createExpense: (expenseData) => authService.api.post('/expenses', expenseData),
  getExpense: (id) => authService.api.get(`/expenses/${id}`),
  updateExpense: (id, expenseData) => authService.api.put(`/expenses/${id}`, expenseData),
  deleteExpense: (id) => authService.api.delete(`/expenses/${id}`),
  getExpensesByGroup: (groupId) => authService.api.get(`/expenses/group/${groupId}`),
};
