import Fetcher from '@http/fetcher'
// TYPES
import { UnparsedBannersAndSlidesT, ResCallback } from '@interfaces/common'
import { BannersImagesEnum } from '@pages/home';

class BannersService {

    static async GetBannersAndSlides(cb: ResCallback<UnparsedBannersAndSlidesT>) {
        try {
            const res = await Fetcher.get<UnparsedBannersAndSlidesT>('/banners')

            if (res?.status === 200) {
                return cb(null, res)
            }
            throw new Error()

        } catch (err: any) {
            cb(err)
        }
    }

    static async PostUpdateBannerOrSlide(formData: FormData, index: number, type: BannersImagesEnum, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.post<string>('/banner', formData, {
                params: {
                    index,
                    type
                }
            })

            if (res?.status === 200 || res?.status === 201) {
                return cb(null, res)
            }
            throw new Error()

        } catch (err: any) {
            cb(err)
        }
    }

    static async DeleteSlide(index: number, cb: ResCallback<void>) {
        try {
            const res = await Fetcher.delete<void>('/slide', {
                params: { index }
            })

            if (res?.status === 200 || res?.status === 204) {
                return cb(null, res)
            }
            throw new Error()

        } catch (err: any) {
            cb(err)
        }
    }
}

export default BannersService