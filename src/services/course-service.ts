import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import { CourseStoreT, CourseT } from '@interfaces/study-center'

class CourseService {

    static async GetCourses(type: 'COURSE' | 'WEBINAR' | null, offset: number, limit: number, count: boolean, cb: ResCallback<CourseStoreT>) {
        try {
            const res = await Fetcher.get<CourseStoreT>('/courses', {
                params: {
                    type: type ? type.toUpperCase() : undefined,
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

    static async AddCourse(formData: FormData, cb: ResCallback<CourseT>) {
        try {
            const res = await Fetcher.put<CourseT>('/courses', formData)

            if (res.status === 201) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdateCourse(courseId: number,formData: FormData, cb: ResCallback<CourseT>) {
        try {
            const res = await Fetcher.post<CourseT>(`/courses/${courseId}`, formData)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async DeleteCourse(courseId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.delete<string>(`/courses/${courseId}`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }
}

export default CourseService