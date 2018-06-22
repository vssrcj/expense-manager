import React from 'react';

import apiHelper from 'api-helper';
import { Table, Typography, TableBody, TableCell, TableRow, Paper, Button, TableHead, Snackbar } from '@material-ui/core';
import UserForm from 'screens/UserForm';

const paperStyle = {
   background: '#fff',
   margin: '0 auto',
};

export default class Users extends React.Component {
   state = {
      users: null,
      message: null,
   };

   componentDidMount() {
      this.getUsers();
   }

   getUsers = async () => {
      try {
         const { data: users } = await apiHelper.get('/api/user');
         this.setState({ users });
      } catch (err) {
         console.warn(err);
      }
   }

   handleFormClose = async (message) => {
      this.setState({ create: false, update: null });
      if (message) {
         await this.getUsers();
         this.setState({ message });
      }
   }

   handleDelete = async (id) => {
      try {
         await apiHelper.delete(`/api/expense/${id}`);
         await this.getUsers();
         this.setState({ message: 'You have successfully deleted your message' });
      } catch (err) {
         this.setState({ message: err.response.data.message });
      }
   }

   render() {
      const {
         users, create, update, message,
      } = this.state;

      return (
         <div style={{ margin: '0 auto' }}>
            {create &&
               <UserForm
                  handleClose={this.handleFormClose}
               />
            }
            {update &&
               <UserForm
                  user={update}
                  handleClose={this.handleFormClose}
               />
            }
            <Snackbar
               anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
               open={!!message}
               onClose={() => this.setState({ message: null })}
               autoHideDuration={6000}
               message={message}
            />
            <Paper style={paperStyle}>
               <Typography variant="headline" component="h1" style={{ padding: '20px 20px 0' }}>
                  All users.
               </Typography>
               {users &&
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell>Name</TableCell>
                           <TableCell>Role</TableCell>
                           <TableCell />
                           <TableCell />
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {users.map(user => (
                           <TableRow key={user.id}>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell padding="none">
                                 <Button
                                    color="primary"
                                    onClick={() => this.setState({ update: user })}
                                 >
                                    Edit
                                 </Button>
                              </TableCell>
                              <TableCell padding="none" style={{ paddingRight: '10px' }}>
                                 <Button onClick={() => this.handleDelete(user.id)}>
                                    Delete
                                 </Button>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               }
               <Button
                  style={{ margin: '20px' }}
                  variant="contained"
                  color="primary"
                  onClick={() => this.setState({ create: true })}
               >
                  Create
               </Button>
            </Paper>
         </div>
      );
   }
}
