import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
// TABS
import PaymentContent from '@pages/payment/payment-content'
import PaymentTariffs from '@pages/payment/payment-tariffs'
// COMPONENTS
import { BreadCrumb, TabItems } from '@components/common'
import { Title } from '@components/common/common'
// STORE
import {
    fetchTariffPeriods, fetchCurrentTariff,
    fetchPaymentHistory, fetchAllTarifs
} from '@store/payment-store'
// STYLE
import '@scss/pages/payment.scss'

const Payment = () => {

    useEffect(() => {
        fetchTariffPeriods()
        fetchCurrentTariff()
        fetchPaymentHistory({})
        fetchAllTarifs()
    }, [])

    return (
        <main className="content-container payment">
            <div className="content-section">
                <div className="top-content">
                    <BreadCrumb items={ ['Главная', 'Оплата'] } />
                    <Title text="Оплата" />
                </div>
                {/* CONTENT */ }
                <div className="tab-section">
                    <div className="tab-cont">
                        {/* TABS */ }
                        <TabItems items={ [
                            { label: 'Продление тарифа', path: '/payment', exact: true },
                            // { label: 'История оплат', path: '/payment/history' },
                            { label: 'Тариф', path: '/payment/info' }
                        ] } />
                        {/* TAB CONTENTS */ }
                        <div className="tab-content-items">
                            <Switch>asd
                                {/* FIRST TAB CONTENT */ }
                                <Route exact path='/payment' component={PaymentContent} />
                                {/* SECOND TAB CONTENT */ }
                                {/*<Route exact path='/payment/history' component={PaymentHistory} />*/}
                                {/* THIRD TAB CONTENT */ }
                                <Route exact path='/payment/info' component={PaymentTariffs} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Payment