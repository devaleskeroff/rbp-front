import React, {useEffect} from 'react'
import { Route, Switch } from 'react-router-dom'
// PAGES
import Users from './users'
import SingleUser from './single-user'
// STORE
import { setModule } from '@store/user-store'
// TYPES
import { Modules } from '@interfaces/common'

const UsersRoutes = () => {

    useEffect(() => {
        setModule(Modules.USERS)
    }, [])

    return (
        <Switch>
            <Route exact path='/users' component={Users} />
            <Route exact path='/users/:id' component={SingleUser} />
        </Switch>
    )
}

export default UsersRoutes
