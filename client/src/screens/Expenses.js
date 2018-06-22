import React from 'react';
import PropTypes from 'prop-types';
import apiHelper from 'api-helper';
import {
   Table, Typography, TableBody, TableCell, TableRow, Paper, Button, TableHead, Snackbar, TextField,
} from '@material-ui/core';
import ExpenseForm from 'screens/ExpenseForm';
import PrintForm from 'screens/PrintForm';

function filterExpenses(expenses, filter) {
   if (!filter) return expenses;
   const lowerCaseFilter = filter.toLowerCase();
   return expenses.filter(expense => Object.keys(expense).some((key) => {
      const value = expense[key].toString().toLowerCase();
      return value.indexOf(lowerCaseFilter) > -1;
   }));
}

export default class AllExpenses extends React.Component {
   static propTypes = {
      authorization: PropTypes.shape().isRequired,
      all: PropTypes.bool,
   }

   state = {
      expenses: null,
      create: false,
      update: null,
      message: null,
      users: null,
      filter: '',
      print: false,
   };

   componentDidMount() {
      this.getUsers();
   }

   getUsers = async () => {
      try {
         const {
            authorization: { id: userId },
            all,
         } = this.props;

         if (all) {
            const { data: expenses } = await apiHelper.get('/api/expense');

            const { data: users } = await apiHelper.get('/api/user');

            this.setState({
               expenses: expenses.map((expense) => {
                  const user = users.find(u => (u.id === expense.userId));
                  return {
                     ...expense,
                     amountDisplay: new Intl.NumberFormat().format(expense.amount),
                     datetimeDisplay: (new Date(expense.datetime)).toLocaleDateString(),
                     user: user ? user.name : '',
                  };
               }),
               users,
            });
         } else {
            const { data: expenses } = await apiHelper.get(`/api/expense/${userId}`);
            this.setState({
               expenses: expenses.map(expense => ({
                  ...expense,
                  amountDisplay: new Intl.NumberFormat().format(expense.amount),
                  datetimeDisplay: (new Date(expense.datetime)).toLocaleDateString(),
               })),
            });
         }
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

   handleFilterChange = ({ target: { value: filter } }) => {
      this.setState({ filter });
   }

   render() {
      const {
         props: { authorization, all },
         state: {
            expenses, create, message, update, users, filter, print,
         },
      } = this;

      if (!expenses) return null;

      const filteredExpenses = filterExpenses(expenses, filter);

      return (
         <div style={{ margin: '0 auto' }}>
            {create &&
               <ExpenseForm
                  users={all ? users : null}
                  userId={authorization.id}
                  handleClose={this.handleFormClose}
               />
            }
            {update &&
               <ExpenseForm
                  userId={authorization.id}
                  expense={update}
                  users={all ? users : null}
                  handleClose={this.handleFormClose}
               />
            }
            {print &&
               <PrintForm
                  handleClose={() => this.setState({ print: false })}
                  expenses={expenses}
                  userName={authorization.name}
               />
            }
            <Snackbar
               anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
               open={!!message}
               onClose={() => this.setState({ message: null })}
               autoHideDuration={6000}
               message={message}
            />
            <Paper style={{ backgroundColor: '#fff' }} open>
               <Typography variant="headline" component="h1" style={{ padding: '20px 20px 0' }}>
                  {all ? 'All' : 'My'} expenses.
               </Typography>
               <div style={{ margin: '0 40px 0 20px' }}>
                  <TextField
                     id="filter"
                     label="Filter"
                     value={filter}
                     multiline
                     onChange={this.handleFilterChange}
                     margin="normal"
                  />
               </div>
               <Table>
                  <TableHead>
                     <TableRow>
                        {all && <TableCell>User</TableCell>}
                        <TableCell>Description</TableCell>
                        <TableCell numeric>Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell />
                        <TableCell />
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {filteredExpenses.map(expense => (
                        <TableRow key={expense.id}>
                           {all && <TableCell>{expense.user}</TableCell>}
                           <TableCell>{expense.description}</TableCell>
                           <TableCell numeric>
                              {expense.amountDisplay}
                           </TableCell>
                           <TableCell>
                              {expense.datetimeDisplay}
                           </TableCell>
                           <TableCell padding="none">
                              <Button
                                 color="primary"
                                 onClick={() => this.setState({ update: expense })}
                              >
                                 Edit
                              </Button>
                           </TableCell>
                           <TableCell padding="none" style={{ paddingRight: '10px' }}>
                              <Button onClick={() => this.handleDelete(expense.id)}>
                                 Delete
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
               <Button
                  style={{ margin: '20px' }}
                  variant="contained"
                  color="primary"
                  onClick={() => this.setState({ create: true })}
               >
                  Create
               </Button>
               {!all &&
                  <Button
                     style={{ margin: '20px 0' }}
                     variant="contained"
                     color="default"
                     onClick={() => this.setState({ print: true })}
                  >
                     Print
                  </Button>
               }
            </Paper>
         </div>
      );
   }
}
