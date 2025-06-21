import { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import CustomerLayout from '../../layouts/CustomerLayout';
import { getRecipients } from '../../utils/api';

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecipients();
        setRecipients(data.data || []);
      } catch (err) {
        setError('Failed to load recipients');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipients();
  }, []);

  return (
    <CustomerLayout>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Recipients</Typography>
          <Button variant="contained" color="primary">Add Recipient</Button>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 'shape.borderRadius' }}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <List>
              {recipients.map((recipient) => (
                <ListItem key={recipient.id} divider>
                  <ListItemText
                    primary={recipient.name}
                    secondary={`Account: ${recipient.account}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </CustomerLayout>
  );
}
