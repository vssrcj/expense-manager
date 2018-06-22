import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import Main from 'screens/Main';

import { getAuthorization } from './auth';

export default function PrivateRoute({ component: Component, roles, ...rest }) {
   const authorization = getAuthorization();

   return (
      <Route
         {...rest}
         render={(renderProps) => {
            if (!authorization) {
               return (
                  <Redirect
                     to={{
                        pathname: '/login',
                        state: { from: renderProps.location },
                     }}
                  />
               );
            }
            if (roles && roles.indexOf(authorization.role) === -1) {
               // If a role is specified on the route, which isn't the user's role.
               // IMPORTANT: make sure the following route doesn't have any roles associated
               // with it.
               return <Redirect to="/" />;
            }
            return (
               <Main
                  currentPath={renderProps.history.location.pathname}
                  authorization={authorization}
               >
                  <Component {...renderProps} authorization={authorization} />
               </Main>
            );
         }}
      />
   );
}

PrivateRoute.propTypes = {
   component: PropTypes.func.isRequired,
   roles: PropTypes.arrayOf(PropTypes.string),
};
