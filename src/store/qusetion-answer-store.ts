import { createStore, createEffect, createEvent } from 'effector'
import { QAItemT, FetchingQADataT } from '@interfaces/question-answer'
import axios from 'axios'

const setQAItems = createEvent<QAItemT[] | false>('Изменение состояния')
const resetQAItems = createEvent('Сброс состояния')

const $QAItems = createStore<QAItemT[] | null | false>(null)
   .on(setQAItems, (state, newData) => newData)
   .reset(resetQAItems)

export const fetchQAItems = createEffect(async () => {
   try {
       const response = await axios.get<FetchingQADataT>(`${process.env.API_URL}/question_answer`)

      setQAItems(response.data.data)
   } catch (err) {
      console.log(err)
      setQAItems(false)
   }
})

export default $QAItems



