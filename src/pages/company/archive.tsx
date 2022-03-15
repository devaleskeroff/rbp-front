import React, { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { ArchiveDocumentTable, ArchiveEmployeeTable } from '@components/tables/archive-tables'
import { TableTopPanel } from '@components/common'
// SERVICE
import ArchiveService from '@services/archive-service'
import {
    $ArchiveCurrentDocuments,
    $ArchiveDocumentsStates,
    setArchiveCommonDocuments,
    setArchiveDocumentsError, setArchiveDocumentsFetched,
    setArchiveDocumentsLoading
} from '@store/company/archive-store'
// STORE
import { setModule } from '@store/user-store'
// TYPES
import { CompanyTabPropsT } from '@interfaces/company/company'
import { Modules } from '@interfaces/common'
// STYLES
import style from '@scss/pages/company/archive.module.scss'

enum ArchiveDocumentTypeEnum {
    document = 1,
    employee
}

const Archive: React.FC<CompanyTabPropsT> = ({ setWithHistory }) => {
    // STORES
    const [dirs, files] = useStore($ArchiveCurrentDocuments)
    const { isFetched } = useStore($ArchiveDocumentsStates)
    // STATES
    const [sortOptionValue, setSortOptionsValue] = useState<0 | 10 | 20>(0)
    const [type, setType] = useState<1 | 2>(1);

    useEffect(() => {
        setModule(Modules.ARCHIVE)

        if (!isFetched) {
            setArchiveDocumentsLoading(true)

            ArchiveService.GetArchiveDocuments(0, (err, res) => {
                if (err || !res) {
                    return setArchiveDocumentsError(true)
                }
                setArchiveCommonDocuments([res.data.directories, res.data.files])
                setArchiveDocumentsFetched(true)
                setArchiveDocumentsLoading(false)
            })
        }
    }, [])

    useEffect(() => {
        setSortOptionsValue(0)
    }, [type])

    return (
        <div className='tab-content-item'>
            <div className={ clsx(style.archive_top_panel) }>
                <button onClick={() => setType(1)} className={ clsx(style.archive__type_btn, {
                    [style.active]: type === ArchiveDocumentTypeEnum.document
                }) }>
                    Документы
                </button>
                <button onClick={() => setType(2)} className={ clsx(style.archive__type_btn, {
                    [style.active]: type === ArchiveDocumentTypeEnum.employee
                }) }>
                    Сотрудники
                </button>
            </div>
            {
                type === ArchiveDocumentTypeEnum.document ?
                    <TableTopPanel hideSearchPanel onSelectOption={e => setSortOptionsValue(e.value as 10 | 20)}
                                   text={ type === ArchiveDocumentTypeEnum.document ?
                                       `Документов: ${ dirs.length + files.length }` :
                                       `Сотрудников: ${ 0 }` }
                    /> : null
            }
            {
                type === ArchiveDocumentTypeEnum.document ?
                    <ArchiveDocumentTable setWithHistory={setWithHistory} sortOptionValue={sortOptionValue} />
                    : <ArchiveEmployeeTable />
            }
        </div>
    )
}

export default Archive
