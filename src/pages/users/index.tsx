import React from 'react'
import Users from './users'
import SingleUser from './single-user'
import { Route, Switch } from 'react-router-dom'

const UsersRoutes = () => {

    return (
        <Switch>
            <Route exact path='/users' component={Users} />
            <Route exact path='/users/:id' component={SingleUser} />
        </Switch>
    )
}

export default UsersRoutes