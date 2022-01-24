import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import {
    PlanGroupDataT,
    PlanGroupsStoreT,
    PlanTaskDataT,
    SimplePlanGroupDataT,
    TaskChangeHistoryT
} from '@interfaces/specialist-plan'
import { CreateNewPlanEventPropsT } from '@interfaces/requests/specialist-plan'

class SpecialistPlanService {

    static async GetSpecialistPlans(companyId: number, offset: number, limit: number, count: boolean, cb: ResCallback<PlanGroupsStoreT | PlanGroupDataT[]>) {
        try {
            const res = await Fetcher.modified.get<PlanGroupsStoreT | PlanGroupDataT[]>('/plans', {
                params: {
                    companyId,
                    offset,
                    limit,
                    count: count || undefined
                }
            })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }
    
    static async GetChangeHistory(taskId: number, cb: ResCallback<TaskChangeHistoryT[]>) {
        try {
            const res = await Fetcher.modified.get<TaskChangeHistoryT[]>(`/plans/task/${ taskId }/history`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async CreateGroup(companyId: number, title: string, cb: ResCallback<SimplePlanGroupDataT>) {
        try {
            const res = await Fetcher.modified.put<SimplePlanGroupDataT>(`/plans/group`, { title, companyId })

            if (res.status === 201) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async CreateNewEvent(companyId: number, data: CreateNewPlanEventPropsT, cb: ResCallback<PlanTaskDataT>) {
        try {
            const res = await Fetcher.modified.put<PlanTaskDataT>('/plans/task', data, {
                params: { companyId }
            })

            if (res.status === 201) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdateGroup(companyId: number, groupId: number, title: string, cb: ResCallback<number>) {
        try {
            const res = await Fetcher.modified.post<number>(`/plans/group/${groupId}`, { title, companyId })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdateEvent(companyId: number, taskId: number, data: CreateNewPlanEventPropsT, cb: ResCallback<number>) {
        try {
            const res = await Fetcher.modified.post<number>(`/plans/task/${ taskId }`, data, {
                params: { companyId }
            })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async ChangeTaskStatus(taskId: number, checked: boolean, cb: ResCallback<number>) {
        try {
            const res = await Fetcher.modified.post<number>(`/plans/task/${ taskId }/status`, { checked })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async ChangeSavedStatus(taskId: number, cb: ResCallback<number>) {
        try {
            const res = await Fetcher.modified.post<number>(`/plans/task/${ taskId }/saved`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async DeleteGroup(companyId: number, groupId: number, cb: ResCallback<number>) {
        try {
            const res = await Fetcher.modified.delete<number>(`/plans/group/${ groupId }`, {
                params: { companyId }
            })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async DeleteTask(companyId: number, taskId: number, groupId: number, cb: ResCallback<number>) {
        try {
            const res = await Fetcher.modified.delete<number>(`/plans/task/${ taskId }`, {
                params: {
                    companyId,
                    groupId
                }
            })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }
}

export default SpecialistPlanService