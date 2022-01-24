import { createEffect, createEvent, createStore } from 'effector'
// STORE
import { resetAllStates } from '@store/user-store'
import { fetchEvents } from '@store/company/event-store'
// SERVICE
import BannersService from '@services/banners-service';
// TYPES
import { HomeStoreT } from '@interfaces/home'
import { EventT } from '@interfaces/company/event'
import { ParsedBannersAndSlidesT } from '@interfaces/common';

// HOME DATA
const setHomeDataFetched = createEvent<boolean>()
const setHomeNotifications = createEvent<EventT[] | false>()
export const setBannersImages = createEvent<ParsedBannersAndSlidesT>()

export const $HomeData = createStore<HomeStoreT>({ notifications: null, isFetched: false, banners: null, slides: null })
    .on(setBannersImages, (oldState, newState) => ({ ...oldState, ...newState }))
    .on(setHomeDataFetched, (oldState, newState) => ({ ...oldState, isFetched: newState }))
    .on(setHomeNotifications, (oldState, newState) => ({ ...oldState, notifications: newState }))
    .reset(resetAllStates)


export const fetchHomeData = createEffect(async () => {
    setHomeDataFetched(true)
    fetchEvents({
        dateStart: null,
        dateFinish: null,
        skip: 0,
        limit: 3,
        cb: (err, res) => {
            if (err || !res) {
                return setHomeNotifications(false)
            }
            setHomeNotifications(res.data as EventT[])
        }
    })

    BannersService.GetBannersAndSlides((err, res) => {
        if (err || !res?.data) {
            return setBannersImages({
                banners: [],
                slides: [],
            })
        }
        setBannersImages({
            banners: JSON.parse(res.data.banners) || [],
            slides: JSON.parse(res.data.slides) || [],
        })
    })
})