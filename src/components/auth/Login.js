import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Container, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('🔍 Attempting login with:', form);
    
    try {
      const response = await login(form);
      console.log('✅ Login successful!', response);
      navigate('/app/dashboard');
    } catch (err) {
      console.error('❌ Login failed:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'primary.main', py: 5 }}>
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>Sign In</Typography>
            {state?.message && <Alert severity="success">{state.message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            
            <Box component="form" onSubmit={submit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Username / Email"
                name="usernameOrEmail"
                value={form.usernameOrEmail}
                onChange={handleChange}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                sx={{ mb: 3 }}
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
              <Button
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/register')}
              >
                Need an account? Register
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
