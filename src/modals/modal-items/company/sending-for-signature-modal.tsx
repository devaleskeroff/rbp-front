import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
// HOOKS
import useModal from '@modals/modal-hook'
// COMPONENTS
import SendingForSignatureTable from '@components/tables/sending-for-signature-tables'
import WorkspacePositionGroups from '@components/company/workspace/positions-groups'
// SERVICE
import EmployeeService from '@services/employee-service'
// TYPES
import { SendingForSignatureDocumentT } from '@interfaces/company/units'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/signing-documents.module.scss'

export type SelectedDocsDataT = {
    positionId: number
    documentId: number
}

const SendingForSignature = () => {
    const [selectedDocs, setSelectedDocs] = useState<Array<SelectedDocsDataT>>([])
    const [currentFilesList, setCurrentFilesList] = useState<SendingForSignatureDocumentT[] | null>(null)
    const [activePositionId, setActivePositionId] = useState<number>(0)
    const [validation, setValidation] = useState({
        signatureError: ''
    })

    const { modalComponent, modalData, close } = useModal()

    useEffect(() => {
        const currentModal = document.querySelector('.' + clsx(style.sending_for_signature_modal)) as HTMLDivElement
        const reactSliderDiv = currentModal.closest('.react-responsive-modal-modal')

        if (reactSliderDiv) {
            reactSliderDiv.classList.add(clsx(style.large_modal))
        }
    }, [])

    useEffect(() => {
        if (activePositionId === 0 && currentFilesList) {
            return
        }
        setCurrentFilesList(null)
        EmployeeService.GetDocumentsForSendingSignature(modalData.employeeId, activePositionId, (err, res) => {
            if (err || !res) {
                return console.log('При получении списка документов произошла ошибка')
            }
            setCurrentFilesList(res.data)
        })
    }, [activePositionId])

    const handleCheckboxChanging: React.ChangeEventHandler<HTMLInputElement> = e => {
        if (e.target.checked) {
            const newSelectedList: SelectedDocsDataT[] = []
            currentFilesList?.forEach(file => newSelectedList.push({
                documentId: file.id,
                positionId: activePositionId
            }))
            setSelectedDocs(newSelectedList)
        } else {
            setSelectedDocs([])
        }
    }

    const handleSubmit = () => {
        EmployeeService.SendForSignature(modalData.employeeId, selectedDocs, (err, res) => {
            if (err) {
                setValidation({ ...validation, signatureError: 'При отправке документов произошла ошибка' })
                return console.log('При отправке документов на подпимсание произошла ошибка')
            }
            if (modalComponent.onConfirm) {
                modalComponent.onConfirm()
            }
            close()
        })
    }

    return (
        <div key={ modalComponent.key } className={ clsx(style.sending_for_signature_modal) }>
            <p className="modal_title">Отправить на подписание</p>
            <div className="underline" />
            <div className={ `modal_content ${ style.adding_doc_modal_content }` }>
                {/* GROUPS */ }
                <div className="mb-15">
                    <WorkspacePositionGroups
                        positions={ modalData.positions }
                        activePositionId={ activePositionId }
                        setActivePositionId={ setActivePositionId }
                    />
                </div>
                {/* SELECTED AMOUNT */ }
                <label htmlFor={ `counter_of_selected` } className={ clsx(style.documents_counter) }>
                    <input type="checkbox" className={ clsx(tableStyle.checkbox_item) }
                           checked={ !!(selectedDocs?.length && selectedDocs.length > 0) }
                           hidden id={ `counter_of_selected` } onChange={ handleCheckboxChanging } />
                    <label htmlFor={ `counter_of_selected` }>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </label>
                    <label htmlFor={ `counter_of_selected` } className={ clsx(tableStyle.checkbox_label) }>
                        Отмечены документов: { selectedDocs.length }
                    </label>
                </label>
                {/* DOCUMENTS TABLE */ }
                <SendingForSignatureTable selectedDocs={ selectedDocs } onSelect={ setSelectedDocs }
                                          files={ currentFilesList } currentPositionId={ activePositionId }
                                          onMoveToArchive={ fileId =>
                                              setCurrentFilesList(currentFilesList!.filter(file => file.id !== fileId))
                                          } />
                {/* SENDING BUTTON */ }
                <button className="modal_btn" disabled={ selectedDocs.length < 1 } onClick={ e => {
                    (e.target as HTMLButtonElement).disabled = true;
                    handleSubmit()
                } }>
                    { selectedDocs.length > 0 ? 'Отправить на подписание' : 'Выберите документы' }
                </button>
            </div>
        </div>
    )
}

export default SendingForSignature