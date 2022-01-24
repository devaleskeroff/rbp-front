import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import {
    GetArchiveDocumentsResT,
    GetArchiveEmployeesResT,
    UnarchiveDirectoryResDataT
} from '@interfaces/requests/archive'
import { WorkspaceFileShortDataT } from '@interfaces/company/workspace'

class ArchiveService {

    static async GetArchiveDocuments(folderId: number, cb: ResCallback<GetArchiveDocumentsResT>) {
        try {
            const res = await Fetcher.modified.get<GetArchiveDocumentsResT>(`/archive/documents/${ folderId }`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async GetArchiveEmployees(cb: ResCallback<GetArchiveEmployeesResT>) {
        try {
            const res = await Fetcher.modified.get<GetArchiveEmployeesResT>(`/archive/employees`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UnarchiveFile(fileId: number, cb: ResCallback<WorkspaceFileShortDataT>) {
        try {
            const res = await Fetcher.modified.delete<WorkspaceFileShortDataT>(`/archive/file/${ fileId }`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UnarchiveDirectory(directoryId: number, cb: ResCallback<UnarchiveDirectoryResDataT>) {
        try {
            const res = await Fetcher.modified.delete<UnarchiveDirectoryResDataT>(`/archive/directory/${ directoryId }`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }
}

export default ArchiveService