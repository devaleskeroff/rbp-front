import React from 'react'
import { Route, Switch } from 'react-router-dom'
// PAGES
import News from './news'
import Practice from './practice'
import CreateNews from './create-news'
import ViewNews from './view-news'
import SpecHelps from '@pages/news/spec-helps'

const NewsAndPracticeRoutes = () => {
    return (
        <Switch>
            <Route exact path={'/news'}>
                <News />
            </Route>
            <Route exact path={'/practices'}>
                <Practice />
            </Route>
            <Route exact path={'/help'}>
                <SpecHelps />
            </Route>
            <Route exact path={['/news/create', '/news/:id/edit', '/practice/:id/edit', '/help/:id/edit']}>
                <CreateNews />
            </Route>
            <Route exact path={'/practice/:id'}>
                <ViewNews path='PRACTICE' />
            </Route>
            <Route exact path={'/news/:id'}>
                <ViewNews path='NEWS' />
            </Route>
            <Route exact path={'/help/:id'}>
                <ViewNews path='SPEC_HELP' />
            </Route>
        </Switch>
    )
}

export default React.memo(NewsAndPracticeRoutes)