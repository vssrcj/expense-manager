import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
   TextField, Dialog, DialogContent, DialogActions, Button, DialogTitle, Select, MenuItem,
   InputLabel, FormControl,
} from '@material-ui/core';
import apiHelper from 'api-helper';


export default class ExpenseForm extends Component {
   static propTypes = {
      userId: PropTypes.number, // required for create
      users: PropTypes.arrayOf(PropTypes.shape()), // required for update
      handleClose: PropTypes.func.isRequired,
      expense: PropTypes.shape(), // required for update
   }

   constructor(props) {
      super(props);
      const { expense = {} } = props;

      this.state = {
         userId: expense.userId || props.userId || '',
         description: expense.description || '',
         amount: expense.amount || '',
         comment: expense.comment || '',
         datetime: (expense.datetime
            ? new Date(expense.datetime)
            : new Date()).toISOString().slice(0, 16),
      };
   }

   onSubmit = async (e) => {
      e.preventDefault();

      const { handleClose, expense } = this.props;

      try {
         const {
            userId,
            datetime,
            description,
            amount,
            comment,
         } = this.state;

         const data = {
            userId,
            datetime: (new Date(datetime)).getTime(),
            description,
            amount: Number.parseFloat(amount),
            comment,
         };

         if (expense) {
            await apiHelper.put(`/api/expense/${expense.id}`, { data });

            handleClose('You have successfully updated your expense.');
         } else {
            await apiHelper.post('/api/expense', { data });

            handleClose('You have successfully created an expense.');
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
         state: {
            datetime, description, amount, comment, userId,
         },
         props: {
            expense, users,
         },
      } = this;

      return (
         <div>
            <Dialog open>
               <form onSubmit={this.onSubmit}>
                  <DialogTitle>{expense ? 'Update' : 'Create'} Expense</DialogTitle>
                  <DialogContent>
                     {users && (
                        <FormControl>
                           <InputLabel htmlFor="user">User</InputLabel>
                           <Select
                              value={userId}
                              onChange={this.handleChange('userId')}
                              inputProps={{
                                 name: 'user',
                                 id: 'user',
                              }}
                           >
                              <MenuItem value="">
                                 <em>None</em>
                              </MenuItem>
                              {users.map(user => (
                                 <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                              ))}
                           </Select>
                        </FormControl>
                     )}
                     <TextField
                        id="description"
                        label="Description"
                        value={description}
                        onChange={this.handleChange('description')}
                        margin="normal"
                        fullWidth
                     />
                     <TextField
                        id="amount"
                        label="Amount"
                        value={amount}
                        onChange={this.handleChange('amount')}
                        margin="normal"
                        type="number"
                        fullWidth
                     />
                     <TextField
                        id="datetime"
                        label="Date Time"
                        value={datetime}
                        onChange={this.handleChange('datetime')}
                        margin="normal"
                        type="datetime-local"
                        fullWidth
                     />
                     <TextField
                        id="comment"
                        label="Comment"
                        value={comment}
                        multiline
                        onChange={this.handleChange('comment')}
                        margin="normal"
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
