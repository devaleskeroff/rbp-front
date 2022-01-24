import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import { CreateEventPropsT, GetEventsPropsT, SendByEmailPropsT } from '@interfaces/requests/event'
import { EventShortDataT, EventsWithCountT, EventT } from '@interfaces/company/event'


class EventService {

    static async GetMonthEvents(dateStart: number, dateFinish: number, cb: ResCallback<EventShortDataT[]>) {
        try {
            const res = await Fetcher.modified.get<EventShortDataT[]>('/events', {
                params: {
                    dateStart,
                    dateFinish
                }
            })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async GetEvents(data: GetEventsPropsT, cb: ResCallback<EventT[] | EventsWithCountT>) {
        try {
            const res = await Fetcher.modified.get<EventT[] | EventsWithCountT>('/events', {
                params: {
                    dateStart: data.dateStart,
                    dateFinish: data.dateFinish,
                    offset: data.skip,
                    limit: data.limit,
                    extended: true,
                    count: data.count || undefined,
                    type: data.type || undefined
                }
            })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async CreateEvent(data: CreateEventPropsT, cb: ResCallback<EventT>) {
        try {
            const res = await Fetcher.modified.put<EventT>('/events', data)
            
            if (res.status === 201) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdateEvent(eventId: number, data: CreateEventPropsT, cb: ResCallback<EventT>) {
        try {
            const res = await Fetcher.modified.post<EventT>(`/events/${eventId}`, data)

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async DeleteEvent(eventId: number, cb: ResCallback<EventT>) {
        try {
            const res = await Fetcher.modified.delete<EventT>(`/events/${eventId}`)

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async SendByEmail(eventId: number, email: string, eventType: 'EVENT' | 'SIGNATURE', cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.post<string>(`/events/${eventId}/email`, { email }, {
                params: { type: eventType === 'EVENT' ? 1 : 2 }
            })

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }
}

export default EventService