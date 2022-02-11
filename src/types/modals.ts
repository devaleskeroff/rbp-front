export type ModalItemEnum =
   | 'EventEmailModal'
   | 'CreateCompanyModal'
   | 'UploadUserImage'
   | 'ConfirmActionModal'
   | 'CreateUserModal'
   | 'CreateWorkspaceGroupModal'
   | 'UploadWorkspaceDocumentModal'
   | 'EditWorkspaceDocumentModal'
   | 'CreateEventModal'
   | 'CreateUnitModal'
   | 'CreateEmployeeModal'
   | 'UploadResponsibilityModal'
   | 'CreateFolderModal'
   | 'SendingForSignatureModal'
   | 'DocumentViewModal'
   | 'AddingUnitDocumentModal'
   | 'SignatureLogModal'
   | 'CreatePlanGroupModal'
   | 'CreatePlanEventModal'
   | 'NotificationModal'
   | 'ViewTaskModal'
   | 'CreateSuperAdminModal'
   | 'RespondToFeedbackModal'
   | 'ChoosingExecutorModal'
   | 'UploadBannerModal'
   | 'CreateLegalInfoFolderModal'
   | 'UploadLegalInformationModal'

export type SetModalComponentPropsT = {
   component: ModalItemEnum
   key?: number
   btnText?: string
   onConfirm?: (() => void) | null
}

export type ModalsListT = {
   [key in ModalItemEnum]: any
}

export type ModalT = {
   display: boolean
}

export type ModalContentT = {
   key: number
   component: any
   btnText: string
   onConfirm?: ((...props: any) => void ) | null
}

export type OpenModalPropsT = {
   modalData?: any
   key?: number
   btnText?: string
   onConfirm?: (...props: any) => void
}
