import React from 'react'
import clsx from 'clsx'
// COMPONENTS
import { Loader } from '@ui/indicators'
// SERVICE
import WorkspaceService from '@services/workspace-service'
// STORE
import { pushToArchiveCommonDocuments } from '@store/company/archive-store'
// TYPES
import { ArchiveFileT } from '@interfaces/company/archive'
import { SendingForSignatureDocumentT } from '@interfaces/company/units'
import { SelectedDocsDataT } from '@modals/modal-items/company/sending-for-signature-modal'
// ICONS
import DownloadIcon from '@assets/images/download.png'
import ArchiveIcon from '@assets/images/archive.png'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/components/tables/sending-for-signature.module.scss'

export type SendingForSignatureTablePropsT = {
    selectedDocs: Array<SelectedDocsDataT>
    onSelect: (val: Array<SelectedDocsDataT>) => void
    currentPositionId: number
    files: SendingForSignatureDocumentT[] | null
    onMoveToArchive: (id: number) => void
}

const SendingForSignatureTable: React.FC<SendingForSignatureTablePropsT> = props => {
    const { selectedDocs, onSelect, currentPositionId, files, onMoveToArchive } = props

    const handleChange = (e: any, id: number) => {
        if (e.target.checked) {
            return onSelect([...selectedDocs, { positionId: currentPositionId, documentId: id }])
        }
        const uncheckedDocIndex = selectedDocs.findIndex(doc => doc.documentId === id && doc.positionId === currentPositionId)
        onSelect(selectedDocs.filter((selectedDoc, idx) => idx !== uncheckedDocIndex))
    }

    const sendFileToArchive = (fileId: number) => {
        WorkspaceService.SendFileToArchive(fileId, (err, res) => {
            if (err) {
                return console.log('При добавлении файла в архив произошла ошибка')
            }
            const newArchiveDoc = files?.find(file => file.id === fileId);
            (newArchiveDoc as any).updatedAt = new Date()

            pushToArchiveCommonDocuments([null, newArchiveDoc as unknown as ArchiveFileT])
            onMoveToArchive(fileId)
        })
    }

    const tableBodyContent = files?.map((file, idx) => {
        const id = file?.id
        return (
            <tr key={idx}>
                <td>
                    <label htmlFor={`${id}`} className={ clsx(tableStyle.column_fixed_height) }>
                        <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden name=""
                               id={`${id}`} onChange={e => handleChange(e, id)}
                               checked={!!selectedDocs.find(selectedDoc => selectedDoc.documentId === id && selectedDoc.positionId === currentPositionId)}
                        />
                        <label htmlFor={`${id}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </label>
                        <label htmlFor={`${id}`} className={ clsx(tableStyle.checkbox_label) }>{ file.title }</label>
                    </label>
                </td>
                <td>
                    <div className={ clsx(style.actions_col) }>
                        <a href={` ${ process.env.API_URL }/api/v1/file/${ file.id }?type=workspace&hash=${ file.hash } `}>
                            <img src={ DownloadIcon } alt="" />
                        </a>
                        <img src={ ArchiveIcon } alt="" onClick={() => sendFileToArchive(id)} />
                    </div>
                </td>
            </tr>
        )
    })

    return (
        <div className={ clsx(tableStyle.base_table_container) }>
            {
                !files ? <Loader autoHeight /> : <table className={ clsx(tableStyle.base_table, style.sending_for_signature_table) }>
                    <thead>
                    <tr>
                        <td>
                            <label>
                                <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name="" />
                                <label>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5 13l4 4L19 7" />
                                    </svg>
                                </label>
                                <label className={ clsx(tableStyle.checkbox_label) }>Название документа</label>
                            </label>
                        </td>
                        <td />
                    </tr>
                    </thead>
                    <tbody>
                    { tableBodyContent }
                    </tbody>
                </table>
            }
        </div>
    )
}

export default SendingForSignatureTable