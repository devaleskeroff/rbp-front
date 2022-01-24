import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import { WorkerShortDataT } from '@interfaces/user'
import { AddNewUserPropsT } from '@interfaces/requests/workers'

class WorkerService {

    static async GetWorkers(userId: number, cb: ResCallback<WorkerShortDataT[]>) {
        try {
            const res = await Fetcher.modified.get<WorkerShortDataT[]>('/users')

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            return cb(err)
        }
    }

    static async AddNewWorker(data: AddNewUserPropsT, cb: ResCallback<WorkerShortDataT>) {
        try {
            const res = await Fetcher.modified.put<WorkerShortDataT>('/users', data)

            if (res.status === 201) {
                return cb(null, res)
            }
        } catch (err) {
            return cb(err)
        }
    }

    static async UpdateWorker(workerId: number, data: AddNewUserPropsT, cb: ResCallback<WorkerShortDataT>) {
        try {
            const res = await Fetcher.modified.post<WorkerShortDataT>(`/users/${workerId}`, data)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            return cb(err)
        }
    }
}

export default WorkerService