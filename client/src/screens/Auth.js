import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
   Redirect,
} from 'react-router-dom';
import { authorize } from 'auth';
import { Paper, Typography, TextField, Button, Snackbar } from '@material-ui/core';

const wrapperStyle = {
   position: 'fixed',
   top: 0,
   left: 0,
   right: 0,
   bottom: 0,
   background: '#eee',
   padding: '40px',
};

const paperStyle = {
   width: '400px',
   padding: '20px',
   margin: '0 auto',
};

export default class Login extends React.Component {
   static propTypes = {
      location: PropTypes.shape().isRequired,
      signup: PropTypes.bool,
   }

   state = {
      name: '',
      password: '',
      redirect: null,
      errorMessage: null,
   }

   submit = async (e) => {
      e.preventDefault();

      try {
         const {
            props: { signup },
            state: { name, password },
         } = this;

         const { data } = await (() => {
            if (signup) return axios.post('/api/signup', { name, password });
            return axios.post('/api/login', { name, password });
         })();

         authorize(data);

         const { from } = this.props.location.state || { from: { pathname: '/' } };

         this.setState({ redirect: from });
      } catch (err) {
         this.setState({ errorMessage: err.response.data.message });
      }
   }

   handleChange = name => ({ target: { value } }) => {
      this.setState({ [name]: value });
   }

   closeErrorMessage = () => {
      this.setState({ errorMessage: null });
   }

   handleSwitchScreen = () => {
      this.setState({ redirect: { pathname: this.props.signup ? '/login' : '/signup' } });
   }

   render() {
      const {
         state: {
            password, name, redirect, errorMessage,
         }, props: {
            signup,
         },
      } = this;

      if (redirect) {
         return <Redirect to={redirect} />;
      }

      return (
         <div style={wrapperStyle}>
            <Snackbar
               anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
               open={!!errorMessage}
               variant="error"
               autoHideDuration={6000}
               onClose={this.closeErrorMessage}
               message={errorMessage}
            />
            <Paper style={paperStyle}>
               <Typography variant="headline" component="h1">
                  {signup ? 'Signup.' : 'Login.'}
               </Typography>
               <form onSubmit={this.submit}>
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
                     type="password"
                     value={password}
                     onChange={this.handleChange('password')}
                     margin="normal"
                     fullWidth
                  />
                  <div style={{ marginTop: '12px' }}>
                     <Button type="submit" color="primary" variant="contained" style={{ marginRight: '20px' }}>
                        {signup ? 'Sign up' : 'Log in'}
                     </Button>
                     <Button variant="contained" onClick={this.handleSwitchScreen}>
                        {signup ? 'Go to login' : 'Go to signup'}
                     </Button>
                  </div>
               </form>
            </Paper>
         </div>
      );
   }
}
