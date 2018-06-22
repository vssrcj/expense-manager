import React from 'react';
import {
   Router,
   Route,
} from 'react-router-dom';

import Users from 'screens/Users';
import Auth from 'screens/Auth';
import Expenses from 'screens/Expenses';
import PrivateRoute from './PrivateRoute';
import history from './history';

export default function App() {
   return (
      <Router history={history}>
         <div>
            <Route path="/signup" component={props => <Auth {...props} signup />} />
            <Route path="/login" component={props => <Auth {...props} />} />

            <PrivateRoute exact path="/" component={props => <Expenses {...props} />} />
            <PrivateRoute exact path="/all-expenses" roles={['admin']} component={props => <Expenses {...props} all />} />
            <PrivateRoute exact path="/users" roles={['admin', 'user-manager']} component={Users} />
         </div>
      </Router>
   );
}
