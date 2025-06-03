import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Sidebar.module.css';

const Sidebar = () => {
  const { authState } = useContext(AuthContext);

  const customerMenu = [
    { text: 'Dashboard', path: '/' },
    { text: 'Recipients', path: '/recipients' },
    { text: 'Transfer', path: '/transfer' },
    { text: 'Debt', path: '/debt' },
    { text: 'Transactions', path: '/transactions' },
    { text: 'Change Password', path: '/change-password' },
  ];

  const adminMenu = [
    { text: 'Admin Dashboard', path: '/admin' },
    { text: 'Change Password', path: '/change-password' },
  ];

  const employeeMenu = [
    { text: 'Employee Dashboard', path: '/employee' },
    { text: 'Change Password', path: '/change-password' },
  ];

  const menuItems = authState.isAuthenticated
    ? authState.user.role === 'customer'
      ? customerMenu
      : authState.user.role === 'admin'
      ? adminMenu
      : employeeMenu
    : [];

  return (
    <Drawer
      variant="permanent"
      className={styles.drawer}
      classes={{ paper: styles.drawerPaper }}
    >
      <div className={styles.toolbar} />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            className={styles.listItem}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;