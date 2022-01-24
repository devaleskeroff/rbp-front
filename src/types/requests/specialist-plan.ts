import { ResCallback } from '@interfaces/common'
import { PlanGroupDataT, PlanGroupsStoreT } from '@interfaces/specialist-plan'

export type CreateNewPlanEventPropsT = {
    title: string
    desc: string
    periodicity: number,
    groupId: number | undefined
    parentId: number | undefined
    startDate: number
    deadline: number
}

export type FetchingPlansPropsT = (
    params: {
        companyId: number
        offset: number
        limit: number
        count?: boolean
        cb?: ResCallback<PlanGroupsStoreT | PlanGroupDataT[]>
    }
) => void