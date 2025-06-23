import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Switch,
} from '@mui/material';
import {
  Send as SendIcon,
  AccountBalance as BankIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useTransfer } from '../../../contexts/TransferContext';

const TransferFormStep = () => {
  const {
    form,
    recipients,
    formatCurrency,
    handleChange,
    handleRecipientChange,
    handleConfirm,
    loading,
  } = useTransfer();

  return (
    <>      
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
        Transfer Details
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box 
        component="form" 
        onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}
        sx={{ maxWidth: '600px', mx: 'auto' }}
      >
        <Grid container spacing={3} >
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.default',
                mb: 1,
                border: '1px solid',
                borderColor: 'divider',
                maxWidth: '500px'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BankIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography fontWeight="medium">
                  {form.transferType === 'internal' ? 'Internal Transfer' : 'External Transfer'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary"></Typography>
                <Switch
                  checked={form.transferType === 'external'}
                  onChange={(e) => 
                    handleChange({
                      target: {
                        name: 'transferType',
                        value: e.target.checked ? 'external' : 'internal'
                      }
                    })
                  }
                  color="primary"
                />
                <Typography variant="body2" color="text.secondary"></Typography>
              </Box>
            </Box>

          </Grid>
          </Grid>
        <Grid container spacing={3}>
          <Grid item size={{ sx: 12, sm: 12, md: 12 }}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, maxWidth: '500px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Recipient</InputLabel>
                    <Select
                      value={form.accountNumberReceiver || 'manual'}
                      onChange={handleRecipientChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="manual">Enter manually</MenuItem>
                      {recipients.map((rec) => (
                        <MenuItem key={rec.recipientId} value={rec.accountNumber}>
                          {rec.recipientNickname || rec.recipientName} ({rec.accountNumber})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Account Number"
                    name="accountNumberReceiver"
                    fullWidth
                    value={form.accountNumberReceiver}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BankIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                {form.transferType === 'external' && (
                  <>
                    <Grid item size={{ sx: 12, sm: 6, md: 6 }}>
                      <TextField
                        label="Source Account Number"
                        name="sourceAccountNumber"
                        fullWidth
                        value={form.sourceAccountNumber}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BankIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item size={{ sx: 12, sm: 6, md: 6}}>
                      <TextField
                        label="Bank ID"
                        name="bankId"
                        fullWidth
                        value={form.bankId}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BankIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item size={{ sx: 12, sm: 6, md: 6}}>
                      <TextField
                        label="Recipient Name"
                        name="recipientName"
                        fullWidth
                        value={form.recipientName}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Grid>
          <Grid item size={{ sx: 12, sm: 12, md: 12}}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, maxWidth: '500px' }}>
              <Grid container spacing={2}>
                <Grid item size={{ sx: 12, sm: 12, md: 12}}>
                  <TextField
                    label="Amount"
                    name="amount"
                    fullWidth
                    value={formatCurrency(form.amount)}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item size={{ sx: 12, sm: 12, md: 12}}>
                  <TextField
                    label="Message"
                    name="message"
                    fullWidth
                    value={form.message}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <MessageIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          {/* Group 4: Fee Type */}            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                maxWidth: '500px'
              }}
            
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography>{form.feeType === 'RECEIVER' ? 'Receiver' : 'Sender'} </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}></Typography>
                <Switch
                  checked={form.feeType === 'RECEIVER'}
                  onChange={(e) => 
                    handleChange({
                      target: {
                        name: 'feeType',
                        value: e.target.checked ? 'RECEIVER' : 'SENDER'
                      }
                    })
                  }
                  color="primary"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}></Typography>
              </Box>
            </Box>

          
          {/* Group 5: Confirm Button */}
          <Grid item xs={12}>            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<SendIcon />}
              sx={{ py: 1.5, mt: 2, maxWidth: '500px' }}
              disabled={loading || !form.accountNumberReceiver || !form.amount}
            >
              Continue
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default TransferFormStep;
