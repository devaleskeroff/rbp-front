import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
import qs from 'qs'
// HOOKS
import useModal from '@modals/modal-hook'
// COMPONENTS
import { WorkspaceGroups } from '@components/company'
// STORE
import {
    $CommonGroupDocuments,
    $WpDocumentsStates,
    fetchWorkspaceCommonData, setCommonGroupDocuments
} from '@store/company/workspace-store'
// SERVICE
import UnitService from '@services/unit-service'
// TYPES
import { WorkspaceFileShortDataT } from '@interfaces/company/workspace'
import { UnitFileForAddingToPositionDataT } from '@interfaces/company/units'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/signing-documents.module.scss'
import AddingDocumentTable from '@components/tables/sending-for-signature-tables/adding-document-table'

const AddingUnitDocumentModal = () => {
    // STORE
    const [commonGroupDirs, commonGroupFiles] = useStore($CommonGroupDocuments)
    const { isFetched } = useStore($WpDocumentsStates)
    // STATES
    const [selectedDocs, setSelectedDocs] = useState<number[]>([])
    const [activeGroupId, setActiveGroupId] = useState<number>(0)
    const [currentFilesList, setCurrentFilesList] = useState<UnitFileForAddingToPositionDataT[] | null>(null)
    const [addedFilesIds, setAddedFilesIds] = useState<number[] | null>(null)
    // UNIT MODE
    const [commonGroupUnitFiles, setCommonGroupUnitFiles] = useState<UnitFileForAddingToPositionDataT[] | null>(null)
    // DATA FETCHING STATES
    const [state, setState] = useState({ unitCommonGroupFilesFetched: false })

    const { modalComponent, modalData, close } = useModal()
    const location = useLocation()

    useEffect(() => {
        // FETCH UNIT FILES AND RETURN IF THERE IS POSITION MODE
        if (modalData.positionMode) {
            UnitService.GetFilesForAddingToPosition({
                unitId: modalData.unitId,
                positionId: modalData.itemId,
                minify: !addedFilesIds ? 'true' : undefined,
                addedFilesIds
            }, (err, res) => {
                if (err || !res) {
                    return console.log('Произошла ошибка при получении файлов')
                }
                if (res.data.addedFilesIds) {
                    setAddedFilesIds(res.data.addedFilesIds)
                }
                setCurrentFilesList(res.data.files)
            })
            return
        }
        if (!isFetched) {
            fetchWorkspaceCommonData()
        }
        const currentModal = document.querySelector('.' + clsx(style.sending_for_signature_modal)) as HTMLDivElement
        const reactSliderDiv = currentModal.closest('.react-responsive-modal-modal')

        if (reactSliderDiv) {
            reactSliderDiv.classList.add(clsx(style.large_modal))
        }
    }, [])

    useEffect(() => {
        // RETURN IF THERE IS POSITION MODE
        if (modalData.positionMode) {
            return
        }
        const groupId = qs.parse(location.search, { ignoreQueryPrefix: true })?.group_id
        if ((!groupId || +groupId === 0) && state.unitCommonGroupFilesFetched) {
            return setCurrentFilesList(commonGroupUnitFiles)
        }
        setCurrentFilesList(null)
        setState({ ...state, unitCommonGroupFilesFetched: true })

        UnitService.GetFilesForAddingToUnit({
            unitId: modalData.itemId,
            minify: !addedFilesIds ? 'true' : undefined,
            addedFilesIds,
            groupId: (groupId && +groupId) ? +groupId : 0
        }, (err, res) => {
            if (err || !res) {
                return console.log('При получении документов произошла ошибка')
            }
            if (!groupId || +groupId === 0) {
                setCommonGroupUnitFiles(res.data.files)
            }
            if (res.data.addedFilesIds) {
                setAddedFilesIds(res.data.addedFilesIds)
            }
            setCurrentFilesList(res.data.files)
        })
    }, [location.search])

    useEffect(() => {
        // RETURN IF THERE IS POSITION MODE
        if (modalData.positionMode) {
            return
        }
        if (isFetched && activeGroupId === 0) {
            setCurrentFilesList(commonGroupUnitFiles)
        }
    }, [isFetched, commonGroupFiles, commonGroupUnitFiles])

    const archiveHandler = (fileId: number) => {
        const updatedFiles = (currentFilesList as WorkspaceFileShortDataT[]).filter(file => file.id !== fileId)
        setCurrentFilesList(updatedFiles)
        if (activeGroupId === 0) {
            setCommonGroupDocuments([commonGroupDirs, commonGroupFiles.filter(file => file.id !== fileId)])
            setCommonGroupUnitFiles((commonGroupUnitFiles as UnitFileForAddingToPositionDataT[]).filter(file => file.id !== fileId))
        }
    }

    const handleCheckboxChanging: React.ChangeEventHandler<HTMLInputElement> = e => {
        if (e.target.checked) {
            const newSelectedList: number[] = []
            currentFilesList?.forEach(file => newSelectedList.push(file.id))
            setSelectedDocs(newSelectedList)
        } else {
            setSelectedDocs([])
        }
    }

    const handleSubmit = () => {
        if (selectedDocs.length === 0) {
            return
        }
        // ADDING DOCUMENT TO UNIT
        if (modalData.unitMode) {
            return UnitService.AddFilesToUnit(modalData.itemId, selectedDocs, (err, res) => {
                if (err) {
                    return console.log('При добавлении документов произошла ошибка')
                }
                close()
            })
        }
        // ADDING DOCUMENT TO UNIT POSITION
        if (modalData.positionMode) {
            return UnitService.AddFilesToPosition(modalData.itemId, selectedDocs, (err, res) => {
                if (err) {
                    return console.log('При добавлении документов произошла ошибка')
                }
                close()
            })
        }
    }

    return (
        <div key={modalComponent.key} className={ clsx(style.sending_for_signature_modal) }>
            <p className="modal_title">Добавить документы</p>
            <div className="underline" />
            <div className={`modal_content ${style.adding_doc_modal_content}`}>
                {/* GROUPS */}
                {
                    !modalData.unitMode ? null :
                    <div className='mb-15'>
                        <WorkspaceGroups activeGroupId={activeGroupId} setActiveGroupId={setActiveGroupId} />
                    </div>
                }
                {/* SELECTED AMOUNT */}
                <label htmlFor={`counter_of_selected`} className={ clsx(style.documents_counter) }>
                    <input type="checkbox" className={ clsx(tableStyle.checkbox_item) }
                           checked={!!(selectedDocs?.length && selectedDocs.length > 0)}
                           hidden id={`counter_of_selected`} onChange={handleCheckboxChanging} />
                    <label htmlFor={`counter_of_selected`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </label>
                    <label htmlFor={`counter_of_selected`} className={ clsx(tableStyle.checkbox_label) }>
                        Отмечены документов: { selectedDocs.length }
                    </label>
                </label>
                {/* DOCUMENTS TABLE */}
                <AddingDocumentTable selectedDocs={selectedDocs} onSelect={setSelectedDocs}
                                          files={currentFilesList} archiveHandler={archiveHandler} />
                {/* SENDING BUTTON */}
                <button className="modal_btn" disabled={ selectedDocs.length < 1 } onClick={ e => {
                    (e.target as HTMLButtonElement).disabled = true
                    handleSubmit()
                } }>
                    { selectedDocs.length > 0 ? 'Добавить документы' : 'Выберите документы' }
                </button>
            </div>
        </div>
    )
}

export default AddingUnitDocumentModal