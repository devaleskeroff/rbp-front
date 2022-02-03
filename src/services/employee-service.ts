import Fetcher from '@http/fetcher'
// TYPES
import { ResCallback } from '@interfaces/common'
import {
    EmployeeDataForSigningT,
    EmployeeDocumentT,
    EmployeeListDataT,
    RelatedEmployeeDataT
} from '@interfaces/company/employees'
import { AddNewEmployeePropsT, SignDocumentsPropsT } from '@interfaces/requests/employee'
import { SendingForSignatureDocumentT } from '@interfaces/company/units'
import { SelectedDocsDataT } from '@modals/modal-items/company/sending-for-signature-modal'

class EmployeeService {

    static async GetEmployees(cb: ResCallback<EmployeeListDataT[]>) {
        try {
            const res = await Fetcher.modified.get<EmployeeListDataT[]>('/employees')

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async GetAllEmployeeData(employeeId: number, extended: boolean, cb: ResCallback<RelatedEmployeeDataT | EmployeeDocumentT[]>) {
        try {
            const res = await Fetcher.modified.get<RelatedEmployeeDataT | EmployeeDocumentT[]>(`/employees/${employeeId}`, {
                params: { extended }
            })

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async GetDocumentsForSendingSignature(employeeId: number, positionId: number, cb: ResCallback<SendingForSignatureDocumentT[]>) {
        try {
            const res = await Fetcher.modified.get<SendingForSignatureDocumentT[]>(`/employees/${employeeId}/signing/files`, {
                params: { positionId }
            })

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async GetDocumentsForSigning(companyId: string, employeeId: string, verifyingId: string, cb: ResCallback<EmployeeDataForSigningT>) {
        try {
            const res = await Fetcher.get<EmployeeDataForSigningT>(`/company/${companyId}/employee/${employeeId}/signing`, {
                params: { verifyingId }
            })

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async AddNewEmployee(data: AddNewEmployeePropsT, cb: ResCallback<EmployeeListDataT>) {
        try {
            const res = await Fetcher.modified.put<EmployeeListDataT>('/employees', data)

            if (res.status === 201) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async UpdateEmployee(employeeId: number, data: AddNewEmployeePropsT, cb: ResCallback<EmployeeListDataT>) {
        try {
            const res = await Fetcher.modified.post<EmployeeListDataT>(`/employees/${employeeId}`, data)

            if (res.status === 200) {
                cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async AddToArchive(employeeId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.put<string>(`/employees/${employeeId}/archive`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async SendForSignature(employeeId: number, documents: SelectedDocsDataT[], cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.post<string>(`/employees/${employeeId}/signature`, { documents })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }


    static async ReSendForSignature(employeeId: number, signatureId: number, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.modified.post<string>(`/employees/${employeeId}/signature/${signatureId}/re-signature`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async MarkDocumentAsViewed(companyId: number, signatureId: number, verifyingId: string, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.post<string>(`/signature/${signatureId}/signing/mark?verifyingId=${verifyingId}`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async SendSigningVerificationCode(companyId: number, employeeId: number, verifyingId: string, cb: ResCallback<string>) {
        try {
            const res = await Fetcher.post<string>(`/employee/${employeeId}/signing_code?verifyingId=${verifyingId}`)

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }

    static async SignDocuments(props: SignDocumentsPropsT, cb: ResCallback<string>) {
        const { companyId, employeeId, verifyingId, code } = props
        try {
            const res = await Fetcher.post<string>(`/company/${companyId}/employee/${employeeId}/sign`, {
                verifyingId,
                code
            })

            if (res.status === 200) {
                return cb(null, res)
            }
        } catch (err) {
            cb(err)
        }
    }
}

export default EmployeeService