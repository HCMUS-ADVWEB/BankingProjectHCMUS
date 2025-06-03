import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import styles from '../styles/Loading.module.css';

const Loading = () => {
  return (
    <Box className={styles.loadingContainer} role="status" aria-label="Loading">
      <CircularProgress color="primary" />
      <span className={styles.loadingText}>Loading...</span>
    </Box>
  );
};

export default Loading;