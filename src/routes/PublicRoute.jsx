import { Route, Redirect } from "react-router-dom";
import AuthService from 'services/auth.service';
import React from 'react'



const PublicRoute = ({ component: Component, restricted, ...rest }) => {
    const { isLogin } = AuthService;
    return (
        <Route {...rest} render={props => (
            isLogin() && restricted ?
                <Redirect to="/" />
                : <Component {...props} />
        )} />
    );
};

export default PublicRoute;