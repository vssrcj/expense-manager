/* global document */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
   Dialog, DialogContent, DialogActions, Button, DialogTitle, Select, MenuItem,
   InputLabel, FormControl,
} from '@material-ui/core';

function printDiv(divName) {
   const content = document.getElementById(divName);
   const pri = document.getElementById('ifmcontentstoprint').contentWindow;
   pri.document.open();
   pri.document.write(content.innerHTML);
   pri.document.close();
   pri.focus();
   pri.print();
}

export default class PrintForm extends Component {
   static propTypes = {
      expenses: PropTypes.arrayOf(PropTypes.shape()).isRequired,
      handleClose: PropTypes.func.isRequired,
      userName: PropTypes.string.isRequired,
   }

   constructor(props) {
      super(props);
      const weeksSet = props.expenses.reduce((res, expense) => {
         const startOfWeek = moment(expense.datetime).startOf('week').valueOf();
         let exist = res[startOfWeek];
         if (exist) {
            exist.push(expense);
         } else {
            exist = [expense];
         }
         return {
            ...res,
            [startOfWeek]: exist,
         };
      }, {});

      const weekKeys = Object.keys(weeksSet).sort();

      this.state = {
         weeks: weekKeys.map(id => ({ id, expenses: weeksSet[id] })),
         week: weekKeys[0],
      };
   }

   onPrint = () => {
      printDiv('print-page');
   }

   handleWeekChange = ({ target: { value: week } }) => {
      this.setState({ week });
   }

   renderPrintPage = () => {
      const { weeks, week: weekId } = this.state;

      const week = weeks.find(w => w.id === weekId);

      const date = moment(Number.parseInt(week.id, 10));
      const start = date.format('D MMM YYYY');
      const end = date.endOf('week').format('D MMM YYYY');

      return (
         <div id="print-page" style={{ display: 'none' }}>
            <style type="text/css">
               {`@media print {
                  @page { margin: 0; }
                  body {
                     font-family: 'Roboto', sans-serif;
                  }
                  #page-body {
                     padding: 20px;
                  }
                  th, td {
                     padding: 15px;
                     text-align: left;
                     border-bottom: 1px solid #ddd;
                  }
                  td {
                     font-weight: 100;
                  }
                  th {
                     color: #99d;
                  }
                  h4 {
                     color: #666;
                  }
                  table {
                     width: 100%;
                  }
                  .right {
                     text-align: right;
                  }
               }`}
            </style>
            <div id="page-body">
               <h2>Expenses for {this.props.userName}</h2>
               <h4>Week from {start} to {end}</h4>
               <table>
                  <thead>
                     <tr>
                        <th>Description</th>
                        <th className="right">Amount</th>
                        <th>Date</th>
                        <th>Comments</th>
                     </tr>
                  </thead>
                  <tbody>
                     {week.expenses.map(expense => (
                        <tr key={expense.id}>
                           <td>{expense.description}</td>
                           <td className="right">{expense.amountDisplay}</td>
                           <td>{expense.datetimeDisplay}</td>
                           <td>{expense.comment}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      );
   }

   render() {
      const { weeks, week } = this.state;

      return (
         <div>
            <iframe id="ifmcontentstoprint" title="sdf" style={{ height: '0px', width: '0px', position: 'absolute' }} />
            {this.renderPrintPage()}
            <Dialog open>
               <DialogTitle>Print expenses</DialogTitle>
               <DialogContent>
                  <FormControl>
                     <InputLabel htmlFor="user">Choose week</InputLabel>
                     <Select
                        value={week}
                        onChange={this.handleWeekChange}
                        inputProps={{
                           name: 'week',
                           id: 'week',
                        }}
                     >
                        {weeks.map((w) => {
                           const date = moment(Number.parseInt(w.id, 10));
                           const start = date.format('D MMM YYYY');
                           const end = date.endOf('week').format('D MMM YYYY');
                           return <MenuItem key={w.id} value={w.id}>{start} - {end}</MenuItem>;
                        })}
                     </Select>
                  </FormControl>
               </DialogContent>
               <DialogActions>
                  <Button onClick={this.props.handleClose} color="primary">
                     Cancel
                  </Button>
                  <Button onClick={this.onPrint} color="primary">
                     Print
                  </Button>
               </DialogActions>
            </Dialog>
         </div>
      );
   }
}
