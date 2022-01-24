import { createEffect, createEvent, createStore } from 'effector'
import { DocumentDataT, PutDocumentCheckboxPropsT } from '@interfaces/document'
import axios from 'axios'

const setDocumentData = createEvent<DocumentDataT | false>('Изменение состояния')
const resetDocumentData = createEvent('Сброс состояния')

export const $Document = createStore<DocumentDataT | null | false>(null)
    .on(setDocumentData, (state, newData) => newData)
    .reset(resetDocumentData)

export const fetchDocumentData = createEffect(async () => {
    try {
        const response = await axios.get<DocumentDataT>(process.env.API_URL + '/document')

        setDocumentData(response.data)
    } catch (err) {
        setDocumentData(false)
    }
})

export const putDocumentCheckbox = createEffect(async ({ checked, type, id }: PutDocumentCheckboxPropsT) => {
    try {
        console.log('PUT REQUEST WAS SENT')
        // const response = await axios.put<DocumentDataT>(process.env.API_URL + '/document', {
        //     checked,
        //     type,
        //     id
        // })

        return true
        // return response.data
    } catch (err) {
        console.log(err)
        return false
    }
})