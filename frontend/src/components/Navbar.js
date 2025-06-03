import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const { authState, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar>
        <Typography variant="h6" className={styles.title}>
          Digital Banking
        </Typography>
        {authState.isAuthenticated && (
          <Button color="inherit" onClick={logout} className={styles.logoutButton}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;