import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import { GetNewsOrPracticesPropsT, GetNewsOrPracticesResT } from '@interfaces/requests/news'
import { NewsT, NewsType } from '@interfaces/news'

class NewsService {

    static async GetNews(props: GetNewsOrPracticesPropsT, cb: ResCallback<GetNewsOrPracticesResT>) {
        try {
            const res = await Fetcher.get<GetNewsOrPracticesResT>('/news', {
                params: {
                    offset: props.skip,
                    limit: props.limit,
                    count: props.count || undefined,
                    type: props.type
                }
            })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            return cb(err)
        }
    }

    static async GetNewsById(id: number, type: NewsType, cb: ResCallback<NewsT>) {
        try {
            const res = await Fetcher.get<NewsT>(`/news/${id}`, { params: { type } })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            return cb(err)
        }
    }

    static async CreateNews(data: FormData, type: NewsType, cb: ResCallback<NewsT>) {
        try {
            const res = await Fetcher.put<NewsT>(`/news`, data, { params: { type } })

            if (res.status === 201) {
                return cb(null, res)
            }
        } catch (err) {
            return cb(err)
        }
    }

    static async UpdateNews(id: number, data: FormData, type: NewsType, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.post<string>(`/news/${id}`, data, { params: { type } })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            return cb(err)
        }
    }

    static async DeleteNews(id: number, type: NewsType, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.delete<string>(`/news/${id}`, { params: { type } })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            return cb(err)
        }
    }
}

export default NewsService