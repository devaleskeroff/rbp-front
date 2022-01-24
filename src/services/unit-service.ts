import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import {
    DocumentSignatureHistoryT,
    GetFilesForAddingToPositionPropsT,
    GetFilesForAddingToUnitPropsT,
    PositionShortDataT,
    UnitFileDataT,
    UnitFileForAddingToUnitAndPositionResT,
    UnitShortDataT
} from '@interfaces/company/units'
import { EmployeeListDataT } from '@interfaces/company/employees'

class UnitService {
    
    static async GetAllUnits(cb: ResCallback<UnitShortDataT[]>) {
        try {
            const res = await Fetcher.modified.get<UnitShortDataT[]>('/units')

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async GetUnitEmployees(unitId: number, cb: ResCallback<EmployeeListDataT[]>) {
        try {
            const res = await Fetcher.modified.get<EmployeeListDataT[]>(`/units/${unitId}/employees`)

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async GetUnitFiles(unitId: number, cb: ResCallback<UnitFileDataT[]>) {
        try {
            const res = await Fetcher.modified.get<UnitFileDataT[]>(`/units/${unitId}/files`)

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async GetFilesForAddingToUnit(props: GetFilesForAddingToUnitPropsT, cb: ResCallback<UnitFileForAddingToUnitAndPositionResT>) {
        const { unitId, groupId, addedFilesIds, minify } = props
        try {
            const res = await Fetcher.modified.post<UnitFileForAddingToUnitAndPositionResT>(
                `/units/${unitId}/files`,
                { addedFilesIds },
                {
                    params: {
                        groupId,
                        minify
                    }
                }
            )

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async GetFilesForAddingToPosition(props: GetFilesForAddingToPositionPropsT, cb: ResCallback<UnitFileForAddingToUnitAndPositionResT>) {
        const { unitId, minify, addedFilesIds, positionId } = props
        try {
            const res = await Fetcher.modified.post<UnitFileForAddingToUnitAndPositionResT>(
                `/units/${unitId}/positions/${positionId}/files`,
                { addedFilesIds },
                { params: { minify } }
            )

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async GetSignatureHistories(unitId: number, documentId: number, cb: ResCallback<DocumentSignatureHistoryT[]>) {
        try {
            const res = await Fetcher.modified.get<DocumentSignatureHistoryT[]>(`/units/${unitId}/document/${documentId}/history`)

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async CreateNewUnit(title: string, cb: ResCallback<UnitShortDataT>) {
        try {
            const res = await Fetcher.modified.put<UnitShortDataT>('/units', { title })

            if (res.status === 201) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdateUnit(unitId: number, title: string, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.post<string>(`/units/${unitId}`, { title })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async AddFilesToUnit(unitId: number, selectedFiles: number[], cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.put<string>(`/units/${unitId}/files`, { files: selectedFiles })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async AddFilesToPosition(positionId: number, selectedFiles: number[], cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.put<string>(`/units/position/${positionId}/files`, { files: selectedFiles })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async RemoveUnit(unitId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.delete<string>(`/units/${unitId}`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async CreateNewPosition(unitId: number, title: string, cb: ResCallback<PositionShortDataT>) {
        try {
            const res = await Fetcher.modified.put<PositionShortDataT>(`/units/${unitId}/position`, { title })

            if (res.status === 201) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdatePosition(positionId: number, title: string, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.post<string>(`/units/position/${positionId}`, { title })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async RemoveUnitPosition(positionId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.delete<string>(`/units/position/${positionId}`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }
}

export default UnitService