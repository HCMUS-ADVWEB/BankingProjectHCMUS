import { Typography } from '@mui/material';

export default function ErrorSuccessMessages({ error, success }) {
  return (
    <>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {success && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}
    </>
  );
}
