import { Route, Redirect } from "react-router-dom";
import AuthService from 'services/auth.service';
import { useContext } from 'react'
import React from 'react'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isLogin } = AuthService;


    return (
        <Route {...rest} render={props => (
            isLogin() ?
                <Component {...props} />
                : <Redirect to="/login" />
        )} />
    );
};


export default PrivateRoute;

