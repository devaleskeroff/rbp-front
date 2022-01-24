import React from 'react'
import { Route, Switch } from 'react-router-dom'
// PAGES
import Prescriptions from './prescriptions'
import CreatePrescription from './create-prescription'
import SinglePrescription from '@pages/prescription/single-prescription'

const PrescriptionRoutes = () => {

    return (
        <Switch>
            <Route exact path={ '/prescriptions' } component={ Prescriptions }/>
            <Route exact path={ '/prescriptions/create' } component={ CreatePrescription }/>
            <Route exact path={ '/prescriptions/:id' } component={ SinglePrescription }/>
            <Route exact path={ '/prescriptions/:id/edit' } component={ CreatePrescription }/>
        </Switch>
    )
}

export default PrescriptionRoutes