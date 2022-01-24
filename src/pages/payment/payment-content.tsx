import React, { useState } from 'react'
import { useStore } from 'effector-react'
// COMPONENTS
import { TarifficationPeriodItems } from '@components/payment'
import Loader from '@ui/indicators/loader'
// STORE
import { $CurrentTariff, $TariffPeriods } from '@store/payment-store'


const PaymentContent = () => {
    const [chosenTariffPeriod, setChosenTariffPeriod] = useState<number | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)
    // STORE
    const tariffPeriods = useStore($TariffPeriods)
    const currentTariff = useStore($CurrentTariff)

    const sendPaymentInfo = () => {
        if(!chosenTariffPeriod) {
            return console.log('Период не выбран')
        }
    }
    
    return (
        <section className="tab-content-item">
            <h4 className="tab-content-title">Продление тарифа</h4>
            <p>Чтобы продлить тариф, выберите срок тарификации и способ оплаты</p>
            {/* TARIFF */ }
            {
                currentTariff === null ? <Loader /> :
                    currentTariff === false ? 'Ошибка загрузки' :
                        <div className="tariff">
                            <div className="tariff-cont">
                                <p className="tariff-title">Тариф { currentTariff.tariff.title }</p>
                                <p className="tariff-subtitle">Ваш выбранный тариф</p>
                                <p className="tariff-desc">У вас осталось { currentTariff.tariff.month_limit } месяца</p>
                            </div>
                        </div>
            }
            {/* TARIFFICATION PERIOD */ }
            <div className="tariffication-period">
                <p className="font-semibold w-full mb-15">Срок тарификации:</p>
                {
                    !tariffPeriods ? 'Loading...' :
                        <TarifficationPeriodItems items={ tariffPeriods } current={ chosenTariffPeriod }
                                                  onClick={ setChosenTariffPeriod } setPrice={ setPrice } />
                }
            </div>
            {/* PAYMENT METHOD */ }
            <div className="payment-method">
                <p className="font-semibold w-full mb-15">Способ оплаты:</p>
                <button className={`payment-method-btn ${paymentMethod === 0 ? 'active' : ''}`}
                        onClick={() => setPaymentMethod(0)}>
                    Онлайн
                </button>
                <button className={`payment-method-btn ${paymentMethod === 1 ? 'active' : ''}`}
                        onClick={() => setPaymentMethod(1)}>
                    Безналичный
                </button>
            </div>
            {/* PAYMENT AMOUNT */ }
            <div className="payment-price">
                <p>Сумма оплаты:</p>
                <span>{ price } р</span>
            </div>
            <button className="small-green-btn mb-15" onClick={sendPaymentInfo}>Перейти к оплате</button>
        </section>
    )
}

export default PaymentContent