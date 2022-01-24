import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import { CompanyT } from '@interfaces/company/company'
import {
    CreateCompanyResT,
    UpdateCompanyResT
} from '@interfaces/requests/company'

class CompanyService {

    static async GetCompany(id: number, cb: ResCallback<CompanyT>) {
        try {
            const res = await Fetcher.get<CompanyT>(`/company/${id}`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async SelectAndGetCompany(cb: ResCallback<CompanyT>) {
        try {
            const res = await Fetcher.get<CompanyT>(`/company/auto`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async CreateCompany(data: FormData, cb: ResCallback<CreateCompanyResT>) {
        try {
            const res = await Fetcher.put<CreateCompanyResT>('/company/create', data)

            if (res.status === 200 || res.status === 201) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdateCompany(id: number, data: FormData, cb: ResCallback<UpdateCompanyResT>) {
        try {
            const res = await Fetcher.post<UpdateCompanyResT>(`/company/${id}`, data)

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async DestroyCompany(id: number, cb: ResCallback<CompanyT | number>) {
        try {
            const res = await Fetcher.delete<CompanyT | number>(`/company/${id}`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }
}

export default CompanyService