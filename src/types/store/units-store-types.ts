import { AxiosError, AxiosResponse } from 'axios'
import { PositionShortDataT, UnitShortDataT } from '@interfaces/company/units'

export type CreateNewUnitPropsT = (
    params: {
        title: string
        cb: (err: AxiosError | null) => void
    }
) => void

export type UpdateUnitPropsT = (
    params: {
        unitId: number
        title: string
        cb: (err: AxiosError | null) => void
    }
) => void

export type CreateNewPositionPropsT = (
    params: {
        unitId: number
        title: string
        cb: (err: AxiosError | null, res?: AxiosResponse<PositionShortDataT>) => void
    }
) => void

export type UpdatePositionPropsT = (
    params: {
        unitId: number
        positionId: number
        title: string
        cb: (err: AxiosError | null, res?: AxiosResponse<string>) => void
    }
) => void