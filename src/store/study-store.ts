import { createStore, createEffect, createEvent } from 'effector'
// TYPES
import { EventStateStoreT } from '@interfaces/common'
import { CourseStoreT, CourseT, FetchingCoursePropsT } from '@interfaces/study-center'
import CourseService from '@services/course-service'

// COURSE ITEMS
export const setCourseStoreData = createEvent<CourseStoreT>()
export const setCourses = createEvent<CourseT[]>()
export const pushToCourses = createEvent<CourseT[]>()
export const updateCourse = createEvent<CourseT>()
export const removeCourse = createEvent<number>()

export const $CourseItems = createStore<CourseStoreT>({
    coursesCount: 0,
    webinarsCount: 0,
    courses: []
})
    .on(setCourseStoreData, (_, newState) => newState)
    .on(setCourses, (oldState, newState) => ({ ...oldState, courses: newState }))
    .on(pushToCourses, (oldState, newState) => ({ ...oldState, courses: [...oldState.courses, ...newState] }))
    .on(updateCourse, (oldState, newState) => ({
            ...oldState,
            courses: oldState.courses.map(course => {
                if (course.id === newState.id) {
                    course = newState
                }
                return course
            })
        })
    )
    .on(removeCourse, (oldState, removedCourseId) => ({
        ...oldState,
        courses: oldState.courses.filter(course => course.id !== removedCourseId)
    }))

// SELECTED COURSE ITEM (FOR UPDATING)
export const setSelectedCourse = createEvent<CourseT | null>()

export const $SelectedCourse = createStore<CourseT | null>(null)
    .on(setSelectedCourse, (_, newState) => newState)

// COURSE DATA STATES
export const setCourseStates = createEvent<EventStateStoreT>()
export const setCourseLoading = createEvent<boolean>()

export const $CourseStates = createStore<EventStateStoreT>({ isLoading: true, error: false, isFetched: false })
    .on(setCourseStates, (_, newState) => newState)
    .on(setCourseLoading, (oldState, newState) => ({ ...oldState, isLoading: newState }))


// REQUESTS
export const fetchCourseItems = createEffect<FetchingCoursePropsT>(async ({ type, offset, limit, count, cb }) => {
    setCourseLoading(true)

    CourseService.GetCourses(type || null, offset, limit, count || false, (err, res) => {
        if (err || !res) {
            if (cb) {
                cb(err)
            }
            return setCourseStates({ isLoading: false, isFetched: false, error: true })
        }
        setCourseStates({ isLoading: false, isFetched: true, error: false })
        if (cb) {
            cb(null, res)
        }
    })
})




