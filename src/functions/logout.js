import React from 'react';
import axios from "axios";

export function logout() {

  localStorage.removeItem('user_id');
  localStorage.removeItem('user_role');

  axios({
    method: 'get',
    url: 'http://13.55.208.161:3000/auth/logout',
    withCredentials: true,
  }).then(response => {
  }).catch((error) => {
  });

  var viewType = localStorage.user_role;

  return viewType;
}
