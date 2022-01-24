import React from 'react'
import { useStore } from 'effector-react'
// COMPONENTS
import { ChoosingTariffTable } from '@components/payment'
// STORE
import { $AllTariffs } from '@store/payment-store'


const PaymentTariffs = () => {
    const allTariffs = useStore($AllTariffs)

    return (
        <section className="tab-content-item">
            <div className="tab-content-item__top-panel">
                <h4 className="tab-content-title">Тарифы</h4>
                <p>Чтобы продлить тариф, выберите срок тарификации и способ оплаты</p>
            </div>
            {/* CHOOSING TARIFF TABLE */}
            <ChoosingTariffTable items={allTariffs} />
        </section>
    )
}

export default PaymentTariffs