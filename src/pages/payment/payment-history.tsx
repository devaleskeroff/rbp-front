import React, { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
// COMPONENTS
import { PaymentHistoryList } from '@components/payment'
// STORE
import { $PaymentHistory, fetchPaymentHistory } from '@store/payment-store'
// TYPES
import { SortOptionT } from '@interfaces/common'

const PaymentHistory = () => {
    // STORE
    const paymentHistory = useStore($PaymentHistory)
    // STATES
    const [optionFilter, setOptionFilter] = useState<string>('default')
    const [searchFilter, setSearchFilter] = useState<string>('')

    const onOptionSelect = (selectedOption: SortOptionT) => {
       // setOptionFilter(option)
       // fetchPaymentHistory({ search: searchFilter, option: selectedOption.value })
    }

    const onSearch = (value: string) => {
       setSearchFilter(value)
       fetchPaymentHistory({ search: value, option: optionFilter })
    }

    return (
        <section className="tab-content-item">
            <div className="tab-content-item__top-panel">
                <h4 className="tab-content-title">История оплат</h4>
                <p>Вы можете ознакомиться с ранее проведенными оплатами</p>
            </div>
            <PaymentHistoryList onOptionSelect={onOptionSelect} onSearch={onSearch} list={paymentHistory}/>
        </section>
    )
}

export default PaymentHistory