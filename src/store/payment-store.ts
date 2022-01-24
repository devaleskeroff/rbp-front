import { createEvent, createStore } from 'effector'
import { createEffect } from 'effector/compat'
import axios from 'axios'
import {
   CurrentTariffT, FetchingCurrentTariffDataT, FetchingPaymentHistoryPropsT,
   FetchingPaymentHistoryUrlParamsT,
   PaymentHistoryDataT,
   PaymentHistoryT,
   TariffPeriodT,
   TariffT
} from '@interfaces/payment'

// CURRENT TARIFF

const setCurrentTariff = createEvent<CurrentTariffT | false>('Изменение состояния')
const resetCurrentTariff = createEvent('Сброс состояния')

export const $CurrentTariff = createStore<CurrentTariffT | null | false>(null)
   .on(setCurrentTariff, (state, newData) => newData)
   .reset(resetCurrentTariff)

export const fetchCurrentTariff = createEffect(async () => {
   try {
      const response = await axios.get<FetchingCurrentTariffDataT>(`${ process.env.API_URL }/tariff`)

      setCurrentTariff(response.data.data)
   } catch (err) {
      console.log(err)
      setCurrentTariff(false)
   }
})

// TARIFF PERIOD

const setTariffPeriods = createEvent<TariffPeriodT[]>('Изменение состояния')
const resetTariffPeriods = createEvent('Сброс состояния')

export const $TariffPeriods = createStore<TariffPeriodT[] | null>(null)
   .on(setTariffPeriods, (state, newData) => newData)
   .reset(resetTariffPeriods)

export const fetchTariffPeriods = createEffect(() => {
   return setTimeout(() => {
      return setTariffPeriods([
         {
            period: 3,
            price: 3900
         },
         {
            period: 5,
            price: 4900
         },
         {
            period: 6,
            price: 5900
         },
         {
            period: 9,
            price: 9900
         }
      ])
   }, 500)
})


// PAYMENT HISTORY

const setPaymentHistory = createEvent<PaymentHistoryT[] | false>('Изменение состояния')
const resetPaymentHistory = createEvent('Сброс состояния')

export const $PaymentHistory = createStore<PaymentHistoryT[] | null | false>(null)
   .on(setPaymentHistory, (state, newData) => newData)
   .reset(resetPaymentHistory)

export const fetchPaymentHistory = createEffect(async ({ search, option }: FetchingPaymentHistoryPropsT) => {
   try {
      const requestParams: FetchingPaymentHistoryUrlParamsT = {}

      if (search) {
         requestParams.q = search
      }

      if (option && option !== 'default') {
         option.toLowerCase() === 'asc' || option.toLowerCase() === 'desc' ?
            requestParams.sort = option.toUpperCase()
            : requestParams.sort_field = option.toLowerCase()
      }
      const response = await axios.get<PaymentHistoryDataT>(`${ process.env.API_URL }/payment_history`, {
         params: requestParams
      })

      return setPaymentHistory(response.data.data)
   } catch (err) {
      console.log(err)
      return setPaymentHistory(false)
   }
})


// CHOOSING TARIFF

const setChosenTariff = createEvent<TariffT[]>('Изменение состояния')
const resetChosenTariff = createEvent('Сброс состояния')

export const $AllTariffs = createStore<TariffT[] | null>(null)
   .on(setChosenTariff, (state, newData) => newData)
   .reset(resetChosenTariff)

export const fetchAllTarifs = createEffect(() => {
   return setTimeout(() => {
      return setChosenTariff([
         {
            title: 'Workplace',
            studyCenter: true,
            notification: true,
            instruction: true,
            organizer: true,
            news: true,
            responsibility: true,
            arbitragePractice: true
         },
         {
            title: 'Light',
            studyCenter: true,
            notification: true,
            instruction: true,
            organizer: true,
            news: false,
            responsibility: false,
            arbitragePractice: false
         }
      ])
   }, 500)
})