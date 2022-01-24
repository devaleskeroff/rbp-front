import { SignatureStatusEnum } from '@interfaces/company/units'
import { AxiosError, AxiosResponse } from 'axios'

export type EventType = 'EVENT' | 'SIGNATURE'

export type EventShortDataT = {
    id: number
    dateStart: number
    dateFinish: number
    type: EventType
    signature?: {
        id: number
        status: SignatureStatusEnum,
        histories: { id: 1 }[]
        file: { title: string }
        position: { title: string }
        signer: {
            id: number
            name: string
        }
    }
}

export type EventT = EventShortDataT & {
    id: number
    title: string
    desc: string
}

export type EventsWithCountT = {
    simpleEventsCount: number
    signatureEventsCount: number
    events: Array<EventShortDataT & {
        id: number
        title: string
        desc: string
    }>
}

export type FetchingEventsDataPropsT = (params: {
    dateStart: number | null
    dateFinish: number | null
    type?: 'EVENT' | 'SIGNATURE' | undefined
    skip?: number
    limit?: number
    count?: boolean
    cb: (err: AxiosError | null, res?: AxiosResponse<EventT[] | EventsWithCountT>) => void
}) => void

export type FetchingMonthEventsDataPropsT = (params: {
    dateStart: number
    dateFinish: number,
    setStore?: boolean
    cb: (err: AxiosError | null, res?: AxiosResponse<EventShortDataT[]>) => void
}) => void

export type CalendarEventItemsPropsT = {
    events: EventT[]
    isPending: boolean
    error: boolean
    onUpdate: (event: EventT) => void
    onDelete: (id: number) => void
}

