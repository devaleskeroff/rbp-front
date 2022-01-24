import React, { useCallback, useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import { Route, Switch } from 'react-router-dom'
// COMPONENTS
import Header from '@components/header'
import MenuPanel from '@components/menu-panel'
// STORE
import { $User, UserRoleEnum } from '@store/user-store'
// TYPES
import { UserDataT } from '@interfaces/user'
// PAGES
import Home from '@pages/home'
import UsersRoutes from '@pages/users'
import Company from '@pages/company/company'
import Profile from '@pages/profile'
import StudyCenterRoutes from '@pages/study-center'
import NewsAndPracticeRoutes from '@pages/news'
import Notifications from '@pages/notifications'
import Payment from '@pages/payment/payment'
import DocumentView from '@pages/document-view'
import QuestionAnswer from '@pages/question-answer'
import Feedbacks from '@pages/feedback/feedback'
import FeedbackItem from '@pages/feedback/feedback-item'
import Responsibility from '@pages/responsibility'
import PrescriptionRoutes from '@pages/prescription'
import SpecialistPlan from '@pages/specialist-plan/specialist-plan'

const AuthUserRoutes = () => {
    const user = useStore($User) as UserDataT
    const [menuDisplay, setMenuDisplay] = useState<boolean>(false)
    const [activeNavUrl, setActiveNavUrl] = useState<string>('')

    const resizeHandler = useCallback(() => {
        const clientWidth = document.documentElement.clientWidth

        if (clientWidth > 1024 && menuDisplay) {
            setMenuDisplay(false)
        }
    }, [menuDisplay])

    // LISTENER FOR CLOSING MENU PANEL, WHEN CLIENT WITH > 1024 && MENU PANEL IS OPEN
    useEffect(() => {
        window.addEventListener('resize', resizeHandler)

        return () => window.removeEventListener('resize', resizeHandler)
    }, [resizeHandler])

    return (
        <>
            {/* HEADER */}
            <Header menuDisplay={ menuDisplay } onBurgerClick={ () => setMenuDisplay(!menuDisplay) }
                    resetActiveNav={ setActiveNavUrl } />
            {/* CONTENT WRAPPER */}
            <div className={ `content-wrapper ${ menuDisplay ? 'with-menu' : '' }` }>
                {/* MENU */}
                <MenuPanel active={ activeNavUrl } onItemClick={ (url: string) => {
                    setActiveNavUrl(url)
                    setMenuDisplay(false)
                } } />
                <Switch>
                    {/* HOME PAGE */ }
                    <Route exact path={ '/' } component={ Home } />
                    {/* USERS (ONLY FOR ADMIN) */ }
                    { user.role === UserRoleEnum.Admin || user.role === UserRoleEnum.SuperAdmin ?
                        <Route path={ '/users' } component={ UsersRoutes } /> : null
                    }
                    {/* COMPANY */ }
                    <Route path={ '/company' } component={ Company } />
                    {/* SPECIALIST PLAN */ }
                    <Route path={ '/specialist-plan' } component={ SpecialistPlan } />
                    {/* PROFILE */ }
                    <Route exact path={ '/profile' } component={ Profile } />
                    {/* STUDY CENTER */}
                    <Route path={ ['/study-center'] } component={ StudyCenterRoutes } />
                    {/* NEWS AND PRACTICE */ }
                    <Route path={ ['/news', '/practices', '/practice', '/help'] } component={ NewsAndPracticeRoutes } />
                    {/* RESPONSIBILITY */}
                    <Route exact path={'/responsibility'} component={ Responsibility } />
                    {/* NOTIFICATIONS */ }
                    <Route exact path={ '/notifications' } component={ Notifications } />
                    {/* PAYMENT */ }
                    <Route path={ '/payment' } component={ Payment } />
                    {/* DOCUMENT VIEW */}
                    <Route exact path={ '/document-view' }>
                        <DocumentView />
                    </Route>
                    {/* QUESTION & ANSWER */}
                    <Route exact path={ '/question-answer' }>
                        <QuestionAnswer />
                    </Route>
                    {/* PRESCRIPTIONS */}
                    {
                        user.role === UserRoleEnum.Client ? null :
                            <Route path={'/prescriptions'} component={ PrescriptionRoutes } />
                    }
                    {/* FEEDBACK */}
                    <Route exact path={ '/feedback' }>
                        <Feedbacks />
                    </Route>
                    <Route exact path={ '/feedback/:id' } component={ FeedbackItem } />
                </Switch>
            </div>
        </>
    )
}

export default AuthUserRoutes