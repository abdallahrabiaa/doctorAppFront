import React, { lazy } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'
import 'react-notifications-component/dist/theme.css'
import PrivateRoute from 'routes/PrivateRoute'
import PublicRoute from 'routes/PublicRoute'
const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const CreateAccount = lazy(() => import('./pages/CreateAccount'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))

function App() {
  return (
    <>

      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <PublicRoute exact restricted={true} path="/login" component={Login} />
          {/* <PublicRoute exact restricted={false} path="/question" component={Question} /> */}
          <PublicRoute exact restricted={true} path="/create-account" component={CreateAccount} />
          <PublicRoute exact restricted={true} path="/forgot-password" component={ForgotPassword} />
          {/* <PublicRoute exact restricted={true} path="/reset-password" component={ResetPassword} /> */}

          {/* Place new routes over this */}
          <PrivateRoute path="/app" component={Layout} />
          {/* If you have an index page, you can remothis Redirect */}
          <Redirect from="*" to="/app" />
        </Switch>
      </Router>
    </>
  )
}

export default App
