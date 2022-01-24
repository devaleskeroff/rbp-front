import React from 'react'
import { Route, Switch } from 'react-router-dom'
// PAGES
import StudyCenter from '@pages/study-center/study-center'
import CreateCourse from '@pages/study-center/create-course'

const StudyCenterRoutes = () => {

    return (
        <Switch>
            {/* COURSES */}
            <Route exact path={'/study-center'} component={ StudyCenter } />
            {/* CREATING */}
            <Route exact path={'/study-center/create'} component={ CreateCourse } />
            {/* UPDATING */}
            <Route exact path={'/study-center/:id'} component={ CreateCourse } />
        </Switch>
    )
}

export default StudyCenterRoutes