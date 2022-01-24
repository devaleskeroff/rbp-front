import { ResCallback } from '@interfaces/common'

export type PrescriptionT = {
    id: number
    title: string
    desc: string
    files: string
    completed: number
    creator: {
        id: number
        name: string
    }
    executor: {
        id: number
        name: string
    }
    createdAt: number
}

export type PrescriptionExecutorT = {
    id: number
    name: string
}

export type PrescriptionExecutorsStateT = {
    count: number
    rows: PrescriptionExecutorT[]
}

export type PrescriptionStoreT = {
    count: number
    rows: PrescriptionT[]
}

export type FetchPrescriptionsPropsT = (
    params: {
        offset: number
        limit: number
        count?: boolean
        cb?: ResCallback<PrescriptionStoreT>
    }
) => void

export type PrescriptionItemsPropsT = {
    item?: [PrescriptionT]
    singleMode?: boolean
}