import React, { useState, useRef } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Avatar,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemAvatar, ListItemText, Alert,
  Divider, IconButton
} from '@mui/material';
import {
  Payment as PaymentIcon, AccountBalanceWallet, QrCodeScanner,
  ContentCopy, Share, Add, CreditCard, CloudUpload, Delete,
  PhotoCamera, Image
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Payment = () => {
  const [upiId, setUpiId] = useState('your-upi@paytm');
  const [openUpiDialog, setOpenUpiDialog] = useState(false);
  const [openQrDialog, setOpenQrDialog] = useState(false);
  const [newUpiId, setNewUpiId] = useState('');
  const [qrImage, setQrImage] = useState(null); // Store uploaded QR image
  const [qrImageUrl, setQrImageUrl] = useState(''); // Store image URL for display
  const fileInputRef = useRef(null);

  const [paymentHistory] = useState([
    {
      id: 1,
      type: 'received',
      amount: 500,
      from: 'John Doe',
      description: 'Pizza expenses',
      date: '2024-01-26',
      method: 'UPI'
    },
    {
      id: 2,
      type: 'sent',
      amount: 250,
      to: 'Sarah Miller',
      description: 'Movie tickets',
      date: '2024-01-25',
      method: 'UPI'
    }
  ]);

  const handleUpdateUpi = () => {
    setUpiId(newUpiId);
    setOpenUpiDialog(false);
    setNewUpiId('');
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    alert('UPI ID copied to clipboard!');
  };

  const handleShareUpi = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My UPI ID',
        text: `Pay me using UPI: ${upiId}`,
      });
    } else {
      handleCopyUpi();
    }
  };

  const generatePaymentLink = (amount, description) => {
    return `upi://pay?pa=${upiId}&pn=SmartBillSplittr&am=${amount}&cu=INR&tn=${description}`;
  };

  // Handle QR image upload
  const handleQrUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        setQrImage(file);
        
        // Create URL for preview
        const imageUrl = URL.createObjectURL(file);
        setQrImageUrl(imageUrl);
        
        console.log('QR Code uploaded:', file.name);
        alert('QR Code uploaded successfully!');
      } else {
        alert('Please select a valid image file');
      }
    }
  };

  // Remove uploaded QR
  const handleRemoveQr = () => {
    setQrImage(null);
    setQrImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Share QR image
  const handleShareQr = async () => {
    if (qrImage && navigator.share) {
      try {
        await navigator.share({
          title: 'My Payment QR Code',
          text: `Scan this QR code to pay me via UPI: ${upiId}`,
          files: [qrImage]
        });
      } catch (error) {
        console.log('Error sharing QR:', error);
        // Fallback to copy UPI ID
        handleCopyUpi();
      }
    } else {
      handleCopyUpi();
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Payment Center
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your payment methods and transaction history
      </Typography>

      <Grid container spacing={3}>
        {/* UPI Section */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <AccountBalanceWallet />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    UPI Payment
                  </Typography>
                </Box>

                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Your UPI ID
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {upiId}
                    </Typography>
                    <Button size="small" onClick={handleCopyUpi}>
                      <ContentCopy fontSize="small" />
                    </Button>
                  </Box>
                </Box>

                <Box display="flex" gap={2} mb={3}>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setOpenUpiDialog(true)}
                    fullWidth
                  >
                    Update UPI ID
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Share />}
                    onClick={handleShareUpi}
                    fullWidth
                  >
                    Share UPI ID
                  </Button>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<QrCodeScanner />}
                  onClick={() => setOpenQrDialog(true)}
                  fullWidth
                  sx={{ bgcolor: 'success.main' }}
                >
                  {qrImage ? 'View QR Code' : 'Upload QR Code'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Pay */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <PaymentIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Quick Pay
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mb: 3 }}>
                  Generate payment links for quick settlements
                </Alert>

                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const link = generatePaymentLink(100, 'Quick Payment');
                      window.open(link, '_blank');
                    }}
                    fullWidth
                  >
                    ₹100
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const link = generatePaymentLink(500, 'Quick Payment');
                      window.open(link, '_blank');
                    }}
                    fullWidth
                  >
                    ₹500
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const link = generatePaymentLink(1000, 'Quick Payment');
                      window.open(link, '_blank');
                    }}
                    fullWidth
                  >
                    ₹1000
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Payment History */}
        <Grid item xs={12}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Payment History
                </Typography>
                <List>
                  {paymentHistory.map((payment) => (
                    <ListItem key={payment.id} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: payment.type === 'received' ? 'success.main' : 'warning.main' 
                        }}>
                          <CreditCard />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" fontWeight="500">
                              {payment.type === 'received' 
                                ? `Received from ${payment.from}` 
                                : `Sent to ${payment.to}`}
                            </Typography>
                            <Typography 
                              variant="h6" 
                              fontWeight="bold"
                              color={payment.type === 'received' ? 'success.main' : 'warning.main'}
                            >
                              {payment.type === 'received' ? '+' : '-'}₹{payment.amount}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {payment.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {payment.date} • {payment.method}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Update UPI Dialog */}
      <Dialog open={openUpiDialog} onClose={() => setOpenUpiDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update UPI ID</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="UPI ID"
            fullWidth
            variant="outlined"
            value={newUpiId}
            onChange={(e) => setNewUpiId(e.target.value)}
            placeholder="anubhav01@paytm"
            helperText="Enter your UPI ID (e.g., 9876543210@paytm)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpiDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateUpi} 
            variant="contained"
            disabled={!newUpiId.trim()}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced QR Code Dialog */}
      <Dialog open={openQrDialog} onClose={() => setOpenQrDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle align="center">
          {qrImage ? 'Your Payment QR Code' : 'Upload Payment QR Code'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleQrUpload}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />

            {/* Display uploaded QR or upload area */}
            {qrImageUrl ? (
              <Box textAlign="center">
                <img
                  src={qrImageUrl}
                  alt="Payment QR Code"
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'contain',
                    border: '2px solid #ddd',
                    borderRadius: '8px'
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Scan this QR code to pay to {upiId}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  width: '200px',
                  height: '200px',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  Click to upload your
                  <br />
                  Payment QR Code
                </Typography>
              </Box>
            )}

            {/* Action buttons */}
            <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
              {!qrImage ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload from Device
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    onClick={() => {
                      // For mobile devices - open camera
                      if (fileInputRef.current) {
                        fileInputRef.current.setAttribute('capture', 'environment');
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    Take Photo
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={handleCopyUpi}
                  >
                    Copy UPI ID
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Share />}
                    onClick={handleShareQr}
                  >
                    Share QR
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Delete />}
                    color="error"
                    onClick={handleRemoveQr}
                  >
                    Remove
                  </Button>
                </>
              )}
            </Box>

            {/* Upload different QR option */}
            {qrImage && (
              <Button
                variant="text"
                startIcon={<Image />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ mt: 1 }}
              >
                Upload Different QR
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQrDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payment;
