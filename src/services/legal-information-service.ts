import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import {
    CreateResponsibilityDirectoryPropsT,
    GetResponsibilityDocumentsResT
} from '@interfaces/requests/responsibility'
import {
    ResponsibilityDirectoryT,
    ResponsibilityFileT
} from '@interfaces/responsibility'
import { ResponsibilityRequestTypeEnum } from '@pages/responsibility'

class LegalInformationService {

    static async GetResponsibilityDocuments(folderId: number | null, cb: ResCallback<GetResponsibilityDocumentsResT>) {
        try {
            const res = await Fetcher.get<GetResponsibilityDocumentsResT>('/responsibility', {
                params: {
                    folderId,
                    type: ResponsibilityRequestTypeEnum.LEGAL_INFORMATION
                }
            })

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async CreateDirectory(data: CreateResponsibilityDirectoryPropsT, cb: ResCallback<ResponsibilityDirectoryT>) {
        try {
            const res = await Fetcher.put<ResponsibilityDirectoryT>('/responsibility/directory', data, {
                params: {
                    type: ResponsibilityRequestTypeEnum.LEGAL_INFORMATION
                }
            })

            if (res.status === 201) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UploadFiles(formData: FormData, folderId: number, cb: ResCallback<ResponsibilityFileT[]>) {
        try {
            const res = await Fetcher.put<ResponsibilityFileT[]>('/responsibility/file', formData, {
                params: {
                    folderId,
                    type: ResponsibilityRequestTypeEnum.LEGAL_INFORMATION
                }
            })

            if (res.status === 201) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdateFile(id: number, title: string, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.post<string>(`/responsibility/file/${id}`, { title })

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdateDirectory(id: number, title: string, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.post<string>(`/responsibility/directory/${id}`, { title })

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async DeleteFile(fileId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.delete<string>(`/responsibility/file/${fileId}`)

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async DeleteDirectory(directoryId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.delete<string>(`/responsibility/directory/${directoryId}`)

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }
}

export default LegalInformationService