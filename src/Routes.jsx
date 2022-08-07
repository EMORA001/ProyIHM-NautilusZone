import React from 'react';
import {
    BrowserRouter as Router,
    Route,
  } from "react-router-dom";
import Login from './components/pages/Login/Login';
import CreateEspecies from './components/pages/CreateEspecies/CreateEspecies';
import CreateUser from './components/pages/CreateUser/CreateUser';

const Routes = () => {
    return (
        <>
            <Router>
                <Route exact path='/' component={Login} />
                <Route exact path='/createUser' component={CreateUser} />
                <Route exact path='/createespecies' component={CreateEspecies} />
            </Router>
        </>
    )
}

export default Routes;