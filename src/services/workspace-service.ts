import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import {
    CreateWorkspaceDirectoryDataT,
    GetWorkspaceResDataT,
    UpdateFileDataT
} from '@interfaces/requests/workspace'
import {
    WorkspaceDirectoryT,
    WorkspaceFileT,
    WorkspaceGroupT
} from '@interfaces/company/workspace'
import { AxiosError } from 'axios'

class WorkspaceService {

    static async GetWorkspace(groupId: number, folderId: number, cb: ResCallback<GetWorkspaceResDataT>) {
        try {
            const res = await Fetcher.modified.get<GetWorkspaceResDataT>(`/workspace?groupId=${groupId}&folderId=${folderId}`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }

    /** START GROUP REQUESTS **/
    static async CreateGroup(title: string, cb: ResCallback<WorkspaceGroupT>) {
        try {
            const res = await Fetcher.modified.put<WorkspaceGroupT>(`/workspace/group`, { title })

            if (res.status === 201) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }

    static async UpdateGroup(groupId: number, title: string, cb: ResCallback<WorkspaceGroupT>) {
        try {
            const res = await Fetcher.modified.post<WorkspaceGroupT>(`/workspace/group/${groupId}`, { title })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }

    static async DeleteGroup(groupId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.delete<string>(`/workspace/group/${groupId}`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }
    /** END OF GROUP REQUESTS **/

    /** START DIRECTORY REQUESTS **/
    static async CreateDirectory(data: CreateWorkspaceDirectoryDataT, cb: ResCallback<WorkspaceDirectoryT>) {
        try {
            const res = await Fetcher.modified.put<WorkspaceDirectoryT>(`/workspace/directory`, { ...data })

            if (res.status === 201) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }

    static async UpdateDirectory(directoryId: number, title: string, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.post<string>(`/workspace/directory/${directoryId}`, { title })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }

    static async SendDirToArchive(directoryId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.put<string>(`/workspace/directory/${directoryId}/archive`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }

    static async DeleteDirectory(directoryId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.delete<string>(`/workspace/directory/${directoryId}`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }
    /** END OF DIRECTORY REQUESTS **/

    /** START FILES REQUESTS **/
    static async UploadFiles(data: FormData, cb: ResCallback<WorkspaceFileT[]>) {
        try {
            const res = await Fetcher.modified.put<WorkspaceFileT[]>(`/workspace/file`, data)

            if (res.status === 201) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }

    static async UpdateFile(fileId: number, data: UpdateFileDataT, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.post<string>(`/workspace/file/${fileId}`, data)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }

    static async SendFileToArchive(fileId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.put<string>(`/workspace/file/${fileId}/archive`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }

    static async DeleteFile(fileId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.delete<string>(`/workspace/file/${fileId}`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err: any) {
            cb(err)
        }
    }
    /** END OF FILE REQUESTS **/
}

export default WorkspaceService