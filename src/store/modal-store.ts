import { createEvent, createStore } from 'effector'
import { ModalContentT, SetModalComponentPropsT, ModalsListT, ModalT } from '@interfaces/modals'
import {
    EventEmailModal,
    CreateCompanyModal,
    UploadUserImageModal,
    ConfirmActionModal,
    CreateUserModal,
    CreateWorkspaceGroupModal,
    UploadWorkspaceDocumentModal,
    EditWorkspaceDocumentModal,
    CreateEventModal,
    CreateUnitModal,
    CreateEmployeeModal,
    UploadResponsibilityModal,
    CreateFolderModal,
    SendingForSignatureModal,
    DocumentViewModal,
    AddingUnitDocumentModal,
    SignatureLogModal,
    CreatePlanGroupModal,
    CreatePlanEventModal,
    NotificationModal,
    ViewTaskModal,
    CreateSuperAdminModal,
    RespondToFeedbackModal,
    ChoosingExecutorModal,
    UploadBannerModal,
    CreateLegalInfoFolderModal,
    UploadLegalInformationModal,
} from '../modals/modal-items'

export const ModalsList: ModalsListT = {
    'EventEmailModal': EventEmailModal,
    'CreateCompanyModal': CreateCompanyModal,
    'UploadUserImage': UploadUserImageModal,
    'ConfirmActionModal': ConfirmActionModal,
    'CreateUserModal': CreateUserModal,
    'CreateWorkspaceGroupModal': CreateWorkspaceGroupModal,
    'UploadWorkspaceDocumentModal': UploadWorkspaceDocumentModal,
    'EditWorkspaceDocumentModal': EditWorkspaceDocumentModal,
    'CreateEventModal': CreateEventModal,
    'CreateUnitModal': CreateUnitModal,
    'CreateEmployeeModal': CreateEmployeeModal,
    'UploadResponsibilityModal': UploadResponsibilityModal,
    'CreateFolderModal': CreateFolderModal,
    'SendingForSignatureModal': SendingForSignatureModal,
    'DocumentViewModal': DocumentViewModal,
    'AddingUnitDocumentModal': AddingUnitDocumentModal,
    'SignatureLogModal': SignatureLogModal,
    'CreatePlanGroupModal': CreatePlanGroupModal,
    'CreatePlanEventModal': CreatePlanEventModal,
    'NotificationModal': NotificationModal,
    'ViewTaskModal': ViewTaskModal,
    'CreateSuperAdminModal': CreateSuperAdminModal,
    'RespondToFeedbackModal': RespondToFeedbackModal,
    'ChoosingExecutorModal': ChoosingExecutorModal,
    'UploadBannerModal': UploadBannerModal,
    'CreateLegalInfoFolderModal': CreateLegalInfoFolderModal,
    'UploadLegalInformationModal': UploadLegalInformationModal,
}

// СОСТОЯНИЕ МОДАЛЬНОГО ОКНА
export const setModalDisplay = createEvent<boolean>('Изменение состояния модального окна')

export const $modal = createStore<ModalT>({ display: false })
    .on(setModalDisplay, (_, newState) => ({ display: newState }))


// КОМПОНЕНТ МОДАЛЬНОГО ОКНА
export const setModalComponent = createEvent<SetModalComponentPropsT>('Изменения контента модального окна')

export const $modalComponent = createStore<ModalContentT>({
    key: Math.random(),
    component: ModalsList['CreateCompanyModal'],
    btnText: 'Создать',
    onConfirm: null
})
    .on(setModalComponent, (_, newState) => ({
            key: newState.key || Math.random(),
            component: ModalsList[newState.component],
            btnText: newState.btnText || 'Создать',
            onConfirm: newState.onConfirm || null
        })
    )

// ДАННЫЕ ДЛЯ КОНТЕНТА МОДАЛЬНОГО ОКНА
export const setModalData = createEvent<any>('Изменение данных контента модального окна')

export const $modalData = createStore<null | any>(null)
    .on(setModalData, (_, newState) => newState)