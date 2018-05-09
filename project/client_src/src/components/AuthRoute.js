import React from 'react';
import { Redirect } from 'react-router';
import { Route } from 'react-router-dom';

function AuthRoute(props) {
  const{
    component: Component,
   isAuthenticated = false,
   ...restProps
 } = props;

 return (
   <Route
     {...restProps}
     render={
       props => isAuthenticated ? (
         <Component {...props} />
       ) : (
         <Redirect to="/sign_in" />
       )
     }
   />
 )
}

export default AuthRoute;
