//import './Login.css';

import React from 'react';
import FormControl from '@mui/material/FormControl';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export function saveToken(token) {
    cookies.set('token', token, {
        path: '/',
        httpOnly: false, // TODO
        secure: false // TODO
      });
}

export function ReadToken() {
    return cookies.get('token');
}

export function Login() {
  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <FormControl>
        <label>
          <p>Username</p>
          <input type="text" />
        </label>
        <label>
          <p>Password</p>
          <input type="password" />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </FormControl>
    </div>
  )
}