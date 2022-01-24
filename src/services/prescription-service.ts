import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import { PrescriptionExecutorT, PrescriptionStoreT, PrescriptionT } from '@interfaces/prescriptions'

class PrescriptionService {

    static async GetPrescriptions(offset: number, limit: number, count: boolean | undefined, cb: ResCallback<PrescriptionStoreT>) {
        try {
            const res = await Fetcher.get<PrescriptionStoreT>('/prescriptions', {
                params: {
                    offset,
                    limit,
                    count
                }
            })

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async GetPrescriptionExecutors(offset: number, search: string | null, count: boolean, cb: ResCallback<{ count?: number, rows: PrescriptionExecutorT[] }>) {
        try {
            const res = await Fetcher.get<{ count?: number, rows: PrescriptionExecutorT[] }>('/prescriptions/executors', {
                params: {
                    offset,
                    search,
                    count: count || null,
                }
            })

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async CreatePrescription(formData: FormData, cb: ResCallback<PrescriptionT>) {
        try {
            const res = await Fetcher.put<PrescriptionT>('/prescriptions', formData)

            if (res.status === 201) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdatePrescription(id: number, formData: FormData, cb: ResCallback<PrescriptionT>) {
        try {
            const res = await Fetcher.post<PrescriptionT>(`/prescriptions/${ id }`, formData)

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async MarkAsCompleted(id: number, checked: boolean, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.post<string>(`/prescriptions/${ id }/mark`, { checked })

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async DeletePrescription(id: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.delete<string>(`/prescriptions/${ id }`)

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }
}

export default PrescriptionService