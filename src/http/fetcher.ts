import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import { Store } from 'effector'
// STORE
import { $Company } from '@store/company/company-store'
// TYPES
import { CompanyT } from '@interfaces/company/company'


class Fetcher {
    private _CompanyStore = $Company as Store<CompanyT>
    private _addCompanyId = false

    private readonly API_URL: string
    private readonly $api: AxiosInstance

    constructor(api_url: string) {
        this.API_URL = api_url + '/api/v1'

        this.$api = axios.create({
            withCredentials: true,
            baseURL: this.API_URL
        })

        this.$api.interceptors.request.use((axiosReq) => {
            axiosReq.headers.authorization = 'Bearer ' + localStorage.getItem('token')
            return axiosReq
        })

        this.$api.interceptors.response.use(
            (successRes: AxiosResponse) => successRes,
            async (error) => {
                const originalRequest = error.config

                if (error.response.status === 401 && error.config && originalRequest._isRetry !== true) {
                    originalRequest._isRetry = true
                    try {
                        const response = await axios.post<{ accessToken: string }>(`${ this.API_URL }/auth/refresh`,
                            {}, { withCredentials: true }
                        )
                        localStorage.setItem('token', response.data.accessToken)

                        return this.$api.request(originalRequest) // продолжаем запрос как это было в схеме)
                    } catch (e) {
                        console.log('Не авторизован')
                    }
                }
                throw error
            }
        )
    }

    private _modifyUrl(url: string): string {
        if (this._addCompanyId) {
            this._addCompanyId = false
            return '/company/' + this._CompanyStore.getState().id + url
        }
        return url
    }

    public get modified(): this {
        this._addCompanyId = true
        return this
    }

    public async get<ResponseT>(url: string, config: AxiosRequestConfig = {}) {
        try {
            url = this._modifyUrl(url)
            return await this.$api.get<ResponseT>(url, config)
        } catch (err) {
            throw err
        }
    }

    public async post<ResponseT>(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
        try {
            url = this._modifyUrl(url)
            return await this.$api.post<ResponseT>(url, data, config)
        } catch (err) {
            throw err
        }
    }

    public async put<ResponseT>(url: string, data: any = {}, config: any = {}) {
        try {
            url = this._modifyUrl(url)
            return await this.$api.put<ResponseT>(url, data, config)
        } catch (err) {
            throw err
        }
    }

    public async delete<ResponseT>(url: string, config: any = {}) {
        try {
            url = this._modifyUrl(url)
            return await this.$api.delete<ResponseT>(url, config)
        } catch (err) {
            throw err
        }
    }
}

export default new Fetcher(process.env.API_URL as string)