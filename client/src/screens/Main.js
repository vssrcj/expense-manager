import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Drawer, MenuItem, Divider, AppBar, Typography, Toolbar } from '@material-ui/core';
import { deauthorize } from 'auth';

const wrapperStyle = {
   position: 'fixed',
   right: 0,
   left: '180px',
   top: '64px',
   bottom: 0,
   background: '#eee',
   display: 'flex',
   flexDirection: 'column',
   padding: '40px',
};

export default function Main({ children, currentPath, authorization: { role, name } }) {
   return (
      <div style={{
         flexGrow: 1,
         height: 430,
         zIndex: 1,
         overflow: 'hidden',
         position: 'relative',
         display: 'flex',
      }}
      >
         <AppBar position="absolute" style={{ zIndex: 2000 }}>
            <Toolbar>
               <Typography variant="title" color="inherit" noWrap style={{ flex: 1 }}>
                  Expense manager
               </Typography>
               <Typography color="inherit">
                  {name}
               </Typography>
               <Typography style={{ color: '#ccc', marginLeft: '20px' }}>
                  {role}
               </Typography>
            </Toolbar>
         </AppBar>
         <Drawer
            variant="permanent"
         >
            <div style={{ marginTop: '64px' }}>
               <Link to="/" style={{ textDecoration: 'none' }}>
                  <MenuItem value="left" selected={currentPath === '/'} style={{ padding: '20px 60px 20px 30px' }}>
                     My expenses
                  </MenuItem>
               </Link>
               {role === 'admin' &&
                  <Link to="/all-expenses" style={{ textDecoration: 'none' }}>
                     <MenuItem value="left" selected={currentPath === '/all-expenses'} style={{ padding: '20px 60px 20px 30px' }}>
                        All expenses
                     </MenuItem>
                  </Link>
               }
               {(role === 'admin' || role === 'user-manager') &&
                  <Link to="/users" style={{ textDecoration: 'none' }}>
                     <MenuItem value="left" selected={currentPath === '/users'} style={{ padding: '20px 60px 20px 30px' }}>
                        Users
                     </MenuItem>
                  </Link>
               }
               <Divider />
               <MenuItem style={{ padding: '20px 40px 20px 30px' }} onClick={deauthorize}>
                  Logout
               </MenuItem>
            </div>
         </Drawer>
         <main style={wrapperStyle}>
            {children}
         </main>
      </div>
   );
}

Main.propTypes = {
   children: PropTypes.node,
   currentPath: PropTypes.string.isRequired,
   authorization: PropTypes.shape().isRequired,
};
