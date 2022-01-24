import React, { useEffect } from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { useStore } from 'effector-react'
// COMPONENTS
import { Modal } from 'react-responsive-modal'
import useModal from '@modals/modal-hook'
import Loader from '@ui/indicators/loader'
// PAGES
import Auth from '@pages/auth'
import AuthUserRoutes from './AuthUserRoutes'
import SigningDocuments from '@pages/signing-documents'
// STORE
import { $Auth, checkAuth } from '@store/auth-store'
// STYLE
import '@scss/components/reset.scss'
import 'react-responsive-modal/styles.css'
import '@scss/app.scss'

const App = () => {
    const isAuth = useStore($Auth)
    const history = useHistory()
    const location = useLocation()
    const { modal, modalComponent, close } = useModal()
    const ModalContent = modalComponent.component

    // CHECKING AUTHORIZATION
    useEffect(() => {
        if (isAuth === null) {
            checkAuth()
        }
        if (isAuth === false && !location.pathname.includes('/signature')) {
            history.push('/login')
        }
        if (isAuth && location.pathname.includes('/login')) {
            history.push('/')
        }
    }, [isAuth, history])

    return (
        <>
            {/* MODAL */}
            <Modal open={ modal.display } onClose={ close } center><ModalContent /></Modal>
            {/* ROUTES */}
            <Switch>
                <Route exact path={ '/signature' } component={SigningDocuments} />
                <Route path={ '/' }>
                    {
                        isAuth === null ? <Loader className="on_site_visit_loader" /> : !isAuth ?
                            <Auth /> :
                            <AuthUserRoutes />
                    }
                </Route>
            </Switch>
        </>
    )
}

export default App