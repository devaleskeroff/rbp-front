import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import { FeedbackT } from '@interfaces/feedback'

class FeedbackService {

    static async GetFeedbacks(cb: ResCallback<FeedbackT[]>) {
        try {
            const res = await Fetcher.get<FeedbackT[]>('/feedbacks')

            if (res.status !== 200) {
                throw new Error()
            }
            return cb(null, res)
        } catch (err) {
            return cb(err)
        }
    }

    static async GetFeedback(id: number, cb: ResCallback<FeedbackT>) {
        try {
            const res = await Fetcher.get<FeedbackT>(`/feedbacks/${id}`)

            if (res.status !== 200) {
                throw new Error()
            }
            return cb(null, res)
        } catch (err) {
            return cb(err)
        }
    }

    static async CreateFeedback(formData: FormData, cb: ResCallback<FeedbackT>) {
        try {
            const res = await Fetcher.put<FeedbackT>('/feedbacks', formData)

            if (res.status !== 201) {
                throw new Error()
            }
            return cb(null, res)
        } catch (err) {
            return cb(err)
        }
    }

    static async RespondToFeedback(id: number, answer: string, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.post<string>(`/feedbacks/${id}`, { answer })

            if (res.status !== 200) {
                throw new Error()
            }
            return cb(null, res)
        } catch (err) {
            return cb(err)
        }
    }
}

export default FeedbackService