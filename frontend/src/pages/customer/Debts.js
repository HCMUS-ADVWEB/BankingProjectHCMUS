import { Container, Typography, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import CustomerLayout from '../../layouts/CustomerLayout';

const debtsData = [
  { id: 1, creditor: 'Bank A', amount: 500, due: '2024-07-01', status: 'Due' },
  { id: 2, creditor: 'Bank B', amount: 700, due: '2024-08-15', status: 'Paid' },
];

export default function DebtsPage() {
  return (
    <CustomerLayout>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Your Debts</Typography>
        <Paper sx={{ p: 2, borderRadius: 'shape.borderRadius' }}>
          <List>
            {debtsData.map((debt) => (
              <ListItem key={debt.id} divider>
                <ListItemText
                  primary={`${debt.creditor} - $${debt.amount}`}
                  secondary={`Due: ${debt.due}`}
                />
                <Chip label={debt.status} color={debt.status === 'Paid' ? 'success' : 'warning'} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </CustomerLayout>
  );
}
