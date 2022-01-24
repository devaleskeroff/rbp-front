import { ApiData, SortOptionT } from '@interfaces/common'

// PAYMENT HISTORY
export type PaymentHistoryT = {
   id: number
   name: string
   term: number
   date_start: string
   income_amount: string
}

export interface PaymentHistoryDataT extends ApiData {
   data: PaymentHistoryT[]
}

export type PaymentHistoryPropsType = {
   list: PaymentHistoryT[] | null | false
   onOptionSelect: (option: SortOptionT) => void
   onSearch: (value: string) => void
}

// PURCHASING TARIFF
export type CurrentTariffT = {
   is_serve: boolean
   tariff: {
      id: number
      title: string
      date_start: string
      date_end: string
      month_limit: number
   }
}

export type FetchingCurrentTariffDataT = {
   success: boolean
   data: CurrentTariffT
}

export type TariffPeriodT = {
   period: number
   price: number
}

export type TariffPeriodPropsT = {
   items: Array<{
      period: number
      price: number
   }>
   current: number | null
   onClick: (idx: number) => void
   setPrice: (price: number) => void
}

export type TariffT = {
   title: string
   studyCenter: boolean
   notification: boolean
   instruction: boolean
   organizer: boolean
   news: boolean
   responsibility: boolean
   arbitragePractice: boolean
}

export type ChoosingTariffTableT = {
   items: TariffT[] | null
}

export const TariffVariants = [1001, 1002, 1003, 1004]

export type FetchingPaymentHistoryPropsT = {
   search?: string
   option?: string
}

export type FetchingPaymentHistoryUrlParamsT = {
   q?: string
   sort?: string
   sort_field?: string
}