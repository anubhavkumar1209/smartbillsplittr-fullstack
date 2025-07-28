import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Container, Alert } from '@mui/material';
import { authService } from '../../services/authService';

export default function Register(){
  const nav = useNavigate();
  const [form,setForm]=useState({username:'',fullName:'',email:'',password:''});
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  const handleChange=e=>setForm({...form,[e.target.name]:e.target.value});

  const submit=async e=>{
    e.preventDefault();
    setLoading(true);setError('');
    try{
      await authService.register(form);
      nav('/login',{state:{message:'Registration successful! Please log in.'}});
    }catch(err){
      setError(err.response?.data?.message || 'Registration failed');
    }finally{ setLoading(false); }
  };

  return(
    <Box sx={{minHeight:'100vh',bgcolor:'primary.main',py:5}}>
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>Create Account</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box component="form" onSubmit={submit} sx={{mt:2}}>
              <TextField fullWidth label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} sx={{mb:2}} required/>
              <TextField fullWidth label="Username" name="username" value={form.username} onChange={handleChange} sx={{mb:2}} required/>
              <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} sx={{mb:2}} required/>
              <TextField fullWidth label="Password" name="password" type="password" value={form.password} onChange={handleChange} sx={{mb:3}} required/>
              <Button type="submit" fullWidth variant="contained" disabled={loading}>
                {loading?'Creating…':'Sign Up'}
              </Button>
              <Button fullWidth sx={{mt:2}} onClick={()=>nav('/login')}>Already have an account? Log in</Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
