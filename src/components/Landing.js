import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Groups, 
  Receipt, 
  AccountBalance, 
  TrendingUp,
  ArrowForward,
  StarRate,
  Security,
  Speed
} from '@mui/icons-material';
import '../Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Groups fontSize="large" />,
      title: "Smart Groups",
      description: "Create unlimited groups and manage expenses effortlessly",
      color: "#667eea"
    },
    {
      icon: <Receipt fontSize="large" />,
      title: "Bill Splitting",
      description: "Automatically split bills with intelligent calculations",
      color: "#f093fb"
    },
    {
      icon: <AccountBalance fontSize="large" />,
      title: "Instant Settlements",
      description: "Track payments and settle balances in real-time",
      color: "#4caf50"
    },
    {
      icon: <TrendingUp fontSize="large" />,
      title: "Analytics",
      description: "Visualize spending patterns with detailed insights",
      color: "#ff9800"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Users" },
    { number: "₹50L+", label: "Bills Split" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      text: "Best app for splitting bills with roommates!",
      rating: 5
    },
    {
      name: "Rahul Singh", 
      text: "Makes group expenses so much easier to manage.",
      rating: 5
    },
    {
      name: "Anita Patel",
      text: "Love the UPI integration and QR features!",
      rating: 5
    }
  ];

  return (
    <Box className="landing-container">
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Chip 
                label="🎉 #1 Bill Splitting App in India" 
                sx={{ 
                  mb: 3, 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
              
              <Typography variant="h1" color="white" gutterBottom sx={{ 
                background: 'linear-gradient(45deg, #ffffff 30%, #f093fb 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                Smart<span style={{ color: '#f093fb' }}>Bill</span>
                <br />
                Splittr
              </Typography>
              
              <Typography variant="h5" color="rgba(255,255,255,0.9)" sx={{ mb: 4, lineHeight: 1.6 }}>
                🚀 Split bills like a pro! Track expenses, settle payments, and never worry about "who owes what" again.
              </Typography>

              <Box display="flex" alignItems="center" gap={2} mb={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  {[1,2,3,4,5].map((star) => (
                    <StarRate key={star} sx={{ color: '#ffc107', fontSize: '1.5rem' }} />
                  ))}
                  <Typography color="white" fontWeight="bold">4.9/5</Typography>
                </Box>
                <Typography color="rgba(255,255,255,0.8)">from 10,000+ users</Typography>
              </Box>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                  sx={{
                    mr: 2,
                    py: 2,
                    px: 4,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)',
                    boxShadow: '0 8px 32px rgba(240, 147, 251, 0.4)',
                    borderRadius: '50px',
                    textTransform: 'none',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 45px rgba(240, 147, 251, 0.6)',
                    }
                  }}
                >
                  Start Free Today
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.4)',
                    borderRadius: '50px',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Sign In
                </Button>
              </motion.div>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Box className="hero-illustration">
                <div className="floating-cards">
                  <motion.div 
                    className="expense-card"
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="card-header">
                      <span className="emoji">🍕</span>
                      <span className="title">Pizza Night</span>
                    </div>
                    <div className="amount">₹1,200</div>
                    <div className="split-info">Split among 4 friends</div>
                  </motion.div>

                  <motion.div 
                    className="expense-card secondary"
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    <div className="card-header">
                      <span className="emoji">🎬</span>
                      <span className="title">Movie Tickets</span>
                    </div>
                    <div className="amount">₹800</div>
                    <div className="split-info">₹200 per person</div>
                  </motion.div>

                  <motion.div 
                    className="expense-card tertiary"
                    animate={{ y: [-5, 15, -5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                  >
                    <div className="card-header">
                      <span className="emoji">☕</span>
                      <span className="title">Coffee Break</span>
                    </div>
                    <div className="amount">₹450</div>
                    <div className="split-info">Quick split</div>
                  </motion.div>
                </div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Box textAlign="center">
                  <Typography variant="h3" color="white" fontWeight="bold">
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="rgba(255,255,255,0.8)">
                    {stat.label}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" align="center" color="white" gutterBottom fontWeight="bold">
            Why Choose SmartBillSplittr?
          </Typography>
          <Typography variant="h6" align="center" color="rgba(255,255,255,0.7)" sx={{ mb: 6 }}>
            Powerful features designed to make expense sharing effortless
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card 
                  className="feature-card"
                  sx={{
                    height: '100%',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-15px) scale(1.02)',
                      background: 'rgba(255,255,255,0.15)',
                      boxShadow: `0 25px 50px ${feature.color}40`
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mx: 'auto', 
                        mb: 3,
                        background: `linear-gradient(45deg, ${feature.color} 30%, ${feature.color}80 90%)`,
                        boxShadow: `0 8px 32px ${feature.color}40`
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" color="white" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.8)" lineHeight={1.6}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" align="center" color="white" gutterBottom fontWeight="bold">
            What Our Users Say
          </Typography>
          <Typography variant="h6" align="center" color="rgba(255,255,255,0.7)" sx={{ mb: 6 }}>
            Join thousands of happy users who trust SmartBillSplittr
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card 
                  sx={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    p: 3,
                    height: '100%'
                  }}
                >
                  <Box display="flex" mb={2}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarRate key={i} sx={{ color: '#ffc107' }} />
                    ))}
                  </Box>
                  <Typography variant="body1" color="white" sx={{ mb: 2, fontStyle: 'italic' }}>
                    "{testimonial.text}"
                  </Typography>
                  <Typography variant="subtitle2" color="rgba(255,255,255,0.8)" fontWeight="bold">
                    - {testimonial.name}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h3" color="white" gutterBottom fontWeight="bold">
            Ready to Split Smart? 🚀
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.8)" sx={{ mb: 4 }}>
            Join 10,000+ users who save time and avoid money conflicts
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/register')}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.3rem',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)',
              boxShadow: '0 8px 32px rgba(240, 147, 251, 0.4)',
              borderRadius: '50px',
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 45px rgba(240, 147, 251, 0.6)',
              }
            }}
          >
            Get Started - It's Free!
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Landing;
