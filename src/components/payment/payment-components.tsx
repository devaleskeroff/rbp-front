import React from 'react'
// COMPONENTS
import { TableTopPanel } from '@components/common'
import Loader from '@ui/indicators/loader'
// TYPES
import { ChoosingTariffTableT, PaymentHistoryPropsType, TariffPeriodPropsT, TariffVariants } from '../../types/payment'

// FIRST TAB COMPONENTS

export const TarifficationPeriodItems = ({ items, current, onClick, setPrice }: TariffPeriodPropsT) => {
   const content = items.map((item, idx) => {
      return (
         <button key={idx} className={ `tariff-period-btn ${ TariffVariants[idx] === current ? 'active' : '' }` }
                 onClick={ () => {
                    setPrice(item.price)
                    onClick(TariffVariants[idx])
                 }
                 }>
            { item.period } мес<br/>{ item.price } ₽
         </button>
      )
   })

   return (
      <>
         { content }
      </>
   )
}


// SECOND TAB COMPONENTS

export const PaymentHistoryList = ({ list, onOptionSelect, onSearch }: PaymentHistoryPropsType) => {
   if (!list) {
      return <div>Loading...</div>
   }

   const content = list.map(payment => {
      const id = payment.id.toString()
      return (
         <tr key={id}>
            <td>{ payment.name }</td>
            <td>{ payment.term }</td>
            <td>{ payment.income_amount }</td>
            <td>{ payment.date_start }</td>
            <td />
         </tr>
      )
   })

   return (
      <>
         <TableTopPanel onSelectOption={onOptionSelect} text={`${ list.length } оплат`} hideSearchPanel
         options={[
            {
               value: 30,
               label: 'По Названию'
            },
            {
               value: 40,
               label: 'По сроку оплаты'
            },
            {
               value: 50,
               label: 'По сумме оплаты'
            }
         ]} />
         <div className="table-container">
            <table className='tab-table'>
               <thead>
               <tr>
                  <td>Оплата</td>
                  <td>Срок оплаты (мес)</td>
                  <td>Сумма (₽)</td>
                  <td>Дата оплаты</td>
                  <td />
               </tr>
               </thead>
               <tbody>
               { content }
               </tbody>
            </table>
         </div>
      </>
   )
}
// THIRD TAB COMPONENTS

const PrintMarkOrCross = ({ value }: { value: boolean }) => {
   return (
      !value ?
         <img src="/img/static/cross.png" alt="" className='' />
         : <img src="/img/static/check-mark.png" alt="" className="" />
   )
}

export const ChoosingTariffTable = ({ items }: ChoosingTariffTableT) => {
   if (!items) {
      return <Loader />
   }

   return (
      <div className="tariff-table-container">
         <table className="tariff-table">
            <thead>
            <tr>
               <td />
               <td>
                  <div className="tariff choosing-tariff">
                     <div className="tariff-cont">
                        <div>
                           <p className="tariff-title">Тариф { items[0].title }</p>
                           <p className="tariff-subtitle">Ваш выбранный тариф</p>
                           <p className="tariff-desc">У вас осталось 3 месяца</p>
                        </div>
                        <button className="choose-tariff-btn">Продлить тариф</button>
                     </div>
                  </div>
               </td>
               <td>
                  <div className="tariff choosing-tariff light-tariff">
                     <div className="tariff-cont">
                        <div>
                           <p className="tariff-title">Тариф { items[1].title }</p>
                           <p className="tariff-subtitle">Бесплатно</p>
                        </div>
                        <button className="choose-tariff-btn">Выбрать тариф</button>
                     </div>
                  </div>
               </td>
            </tr>
            </thead>
            <tbody>
            <tr>
               <td>Учебный центр</td>
               <td><PrintMarkOrCross value={items[0].studyCenter} /></td>
               <td><PrintMarkOrCross value={items[1].studyCenter} /></td>
            </tr>
            <tr>
               <td>Оповещения</td>
               <td><PrintMarkOrCross value={items[0].notification} /></td>
               <td><PrintMarkOrCross value={items[1].notification} /></td>
            </tr>
            <tr>
               <td>Предписания</td>
               <td><PrintMarkOrCross value={items[0].instruction} /></td>
               <td><PrintMarkOrCross value={items[1].instruction} /></td>
            </tr>
            <tr>
               <td>Органайзер</td>
               <td><PrintMarkOrCross value={items[0].organizer} /></td>
               <td><PrintMarkOrCross value={items[1].organizer} /></td>
            </tr>
            <tr>
               <td>Новости</td>
               <td><PrintMarkOrCross value={items[0].news} /></td>
               <td><PrintMarkOrCross value={items[1].news} /></td>
            </tr>
            <tr>
               <td>Ответственность</td>
               <td><PrintMarkOrCross value={items[0].responsibility} /></td>
               <td><PrintMarkOrCross value={items[1].responsibility} /></td>
            </tr>
            <tr>
               <td>Судебная практика</td>
               <td><PrintMarkOrCross value={items[0].arbitragePractice} /></td>
               <td><PrintMarkOrCross value={items[1].arbitragePractice} /></td>
            </tr>
            </tbody>
         </table>
      </div>
   )
}