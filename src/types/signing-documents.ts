import { SigningDocumentT } from '@interfaces/company/employees'

export type SigningDocumentsPropsT = {
    items: SigningDocumentT[]
    onReadyToSign: () => void
}