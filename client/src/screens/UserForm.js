import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
   TextField, Dialog, DialogContent, DialogActions, Button, DialogTitle, Select, MenuItem,
   InputLabel, FormControl,
} from '@material-ui/core';
import apiHelper from 'api-helper';

const roles = [
   { id: 'user', name: 'User' },
   { id: 'user-manager', name: 'User Manager' },
   { id: 'admin', name: 'Admin' },
];

export default class UserForm extends Component {
   static propTypes = {
      user: PropTypes.shape(), // required for update
      handleClose: PropTypes.func.isRequired,
   }

   constructor(props) {
      super(props);
      const { user = {} } = props;

      this.state = {
         name: user.name || '',
         role: user.role || '',
         password: '',
      };
   }

   onSubmit = async (e) => {
      e.preventDefault();

      const { handleClose, user } = this.props;

      try {
         const {
            name,
            role,
            password,
         } = this.state;

         const data = {
            name,
            role,
            password,
         };

         if (user) {
            await apiHelper.put(`/api/user/${user.id}`, { data });

            handleClose('You have successfully updated the user.');
         } else {
            await apiHelper.post('/api/user', { data });

            handleClose('You have successfully created a user.');
         }
      } catch (err) {
         // eslint-disable-next-line
         alert(err.response.data.message);
      }
   }

   handleChange = name => ({ target: { value } }) => {
      this.setState({ [name]: value });
   }

   render() {
      const {
         props: {
            user,
         },
         state: {
            name, password, role,
         },
      } = this;

      return (
         <div>
            <Dialog open>
               <form onSubmit={this.onSubmit}>
                  <DialogTitle>{user ? 'Update' : 'Create'} user</DialogTitle>
                  <DialogContent>
                     <FormControl>
                        <InputLabel htmlFor="user">Role</InputLabel>
                        <Select
                           value={role}
                           onChange={this.handleChange('role')}
                           inputProps={{
                              name: 'role',
                              id: 'role',
                           }}
                        >
                           <MenuItem value="">
                              <em>None</em>
                           </MenuItem>
                           {roles.map(r => (
                              <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                           ))}
                        </Select>
                     </FormControl>
                     <TextField
                        id="name"
                        label="Name"
                        value={name}
                        onChange={this.handleChange('name')}
                        margin="normal"
                        fullWidth
                     />
                     <TextField
                        id="password"
                        label="Password"
                        value={password}
                        onChange={this.handleChange('password')}
                        margin="normal"
                        type="password"
                        fullWidth
                     />
                  </DialogContent>
                  <DialogActions>
                     <Button onClick={() => this.props.handleClose(false)} color="primary">
                        Cancel
                     </Button>
                     <Button type="submit" color="primary">
                        Submit
                     </Button>
                  </DialogActions>
               </form>
            </Dialog>
         </div>
      );
   }
}
