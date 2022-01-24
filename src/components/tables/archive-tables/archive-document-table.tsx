import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useStore } from 'effector-react'
import moment from 'moment'
import qs from 'qs'
import clsx from 'clsx'
// COMPONENTS
import { ErrorIndicator, Loader } from '@ui/indicators'
// TYPES
import { ArchiveDirectoryDataT, ArchiveFileT, DocumentArchiveTablePropsT } from '@interfaces/company/archive'
// SERVICE
import ArchiveService from '@services/archive-service'
// STORE
import {
    $ArchiveCommonDocuments,
    $ArchiveCurrentDocuments,
    $ArchiveDocumentsStates,
    setArchiveCommonDocuments,
    setArchiveCurrentDocuments,
    setArchiveDocumentsError,
    setArchiveDocumentsLoading
} from '@store/company/archive-store'
import { pushToCommonGroupDocuments } from '@store/company/workspace-store'
import { $UserRole, UserRoleEnum } from '@store/user-store'
// ICON
import UnarchiveIcon from '@assets/images/unarchive.png'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/company/company-workspace.module.scss'
import { Tooltip } from '@material-ui/core'

moment.locale('ru')

const ArchiveDocumentTable: React.FC<DocumentArchiveTablePropsT> = ({ setWithHistory, sortOptionValue }) => {
    // STORE
    const archiveCommonDocuments = useStore($ArchiveCommonDocuments)
    const archiveCurrentDocuments = useStore($ArchiveCurrentDocuments)
    const { isLoading, error } = useStore($ArchiveDocumentsStates)
    const userRole = useStore($UserRole)
    // STATE
    const [directoryId, setDirectoryId] = useState<number>(0)
    const [paths, setPaths] = useState<ArchiveDirectoryDataT[]>([])

    const { pathname } = useLocation()
    const history = useHistory()

    useEffect(() => {
        const Querystring = qs.parse(history.location.search, { ignoreQueryPrefix: true })
        const folderId = Querystring?.folder_id

        if (folderId && +folderId) {
            if (paths.length > 1 && paths[paths.length - 2]?.id === +folderId) {
                paths.pop()
                setPaths(paths)
            } else {
                paths.push(archiveCurrentDocuments[0].find(dir => dir.id === +folderId) as ArchiveDirectoryDataT)
            }
        } else {
            setPaths([])
        }

        setDirectoryId(+(folderId as string) || 0)
    }, [history.location.search])

    useEffect(() => {
        if (directoryId === 0) {
            setWithHistory(false)
            setArchiveCurrentDocuments(sortDocuments(archiveCommonDocuments))
            return
        }
        setArchiveDocumentsLoading(true)

        ArchiveService.GetArchiveDocuments(directoryId, (err, res) => {
            if (err || !res) {
                return setArchiveDocumentsError(true)
            }
            setArchiveCurrentDocuments(sortDocuments([res.data.directories, res.data.files]))
            setArchiveDocumentsLoading(false)
        })
    }, [directoryId])

    useEffect(() => {
        if (directoryId === 0) {
            setArchiveCurrentDocuments(sortDocuments(archiveCommonDocuments))
        }
    }, [archiveCommonDocuments])

    useEffect(() => {
        setArchiveCurrentDocuments(archiveCommonDocuments)
    }, [])

    useEffect(() => {
        if (directoryId === 0) {
            setArchiveCurrentDocuments(sortDocuments(archiveCommonDocuments))
            return
        }
        setArchiveCurrentDocuments(sortDocuments(archiveCurrentDocuments))
    }, [sortOptionValue])

    // HANDLING DOUBLE CLICK
    const handleDoubleClick = (id: number) => {
        let newQueryStringObj: any = {
            folder_id: id
        }

        setWithHistory(true)
        history.push({
            pathname,
            search: qs.stringify(newQueryStringObj)
        })
    }

    const UnarchiveHandler = (dirId: number | null, fileId: number | null) => {
        if (dirId) {
            ArchiveService.UnarchiveDirectory(dirId, (err, res) => {
                if (err || !res) {
                    return console.log('Произошла неожиданная ошибка')
                }
                if (!res.data.groupId) {
                    pushToCommonGroupDocuments([
                        archiveCommonDocuments[0].find(dir => dir.id === dirId) as unknown as ArchiveDirectoryDataT,
                        null
                    ])
                }

                const updatedCurrentDocuments = [
                    archiveCurrentDocuments[0].filter(dir => dir.id !== dirId),
                    archiveCurrentDocuments[1]
                ] as [ArchiveDirectoryDataT[], ArchiveFileT[]]

                setArchiveCurrentDocuments(updatedCurrentDocuments)
                setArchiveCommonDocuments(updatedCurrentDocuments)
            })
        }
        if (fileId) {
            ArchiveService.UnarchiveFile(fileId, (err, res) => {
                if (err || !res) {
                    return console.log('Произошла неожиданная ошибка')
                }
                if (!res.data.groupId) {
                    pushToCommonGroupDocuments([null, res.data])
                }

                const updatedCurrentDocuments = [
                    archiveCurrentDocuments[0],
                    archiveCurrentDocuments[1].filter(file => file.id !== fileId)
                ] as [ArchiveDirectoryDataT[], ArchiveFileT[]]

                setArchiveCurrentDocuments(updatedCurrentDocuments)
                setArchiveCommonDocuments(updatedCurrentDocuments)
            })
        }
    }

    const sortDocuments = (documents: [ArchiveDirectoryDataT[], ArchiveFileT[]]) => {
        if (sortOptionValue === 10) {
            documents.forEach(docs => {
                docs.sort((doc1, doc2) => {
                    return new Date(doc2.updatedAt).getTime() - new Date(doc1.updatedAt).getTime()
                })
            })
        } else if (sortOptionValue === 20) {
            documents.forEach(docs => {
                docs.sort((doc1, doc2) => {
                    return new Date(doc1.updatedAt).getTime() - new Date(doc2.updatedAt).getTime()
                })
            })
        }
        return Array.from(documents) as [ArchiveDirectoryDataT[], ArchiveFileT[]]
    }

    const tableDirectoriesContent = archiveCurrentDocuments[0].map(item => {

        const firstRow = (
            <label htmlFor={ `key` } className={ clsx(tableStyle.column_fixed_height) }>
                <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name=""
                       id={ `key` } />
                <label htmlFor={ `key` }>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </label>
                <svg className={ clsx(style.file_icon) } viewBox="0 0 36 36" fill="none"
                     xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                    <path
                        d="M0 11.7761V30.3969C0 31.452 0.806906 32.259 1.86209 32.259H34.1379C35.1931 32.259 36 31.452 36 30.3969V11.7761C36 10.721 35.1931 9.91406 34.1379 9.91406H1.86209C0.806906 9.91406 0 10.7831 0 11.7761Z"
                        fill="#F7B84E" />
                    <path
                        d="M32.8963 9.93103C32.8963 8.56549 31.779 7.44829 30.4135 7.44829H20.4825L17.379 3.72412H3.7239C2.66872 3.72412 1.86182 4.59311 1.86182 5.58621V9.93103H32.8963Z"
                        fill="#E4A12F" />
                </svg>
                <label htmlFor={ `key` } className={ clsx(tableStyle.checkbox_label) }>{ item.title }</label>
            </label>
        )

        return (
            <tr key={ item.id }>
                <td>
                    <button className={ clsx(style.folder) }
                            onDoubleClick={ () => handleDoubleClick(item.id) }>
                        { firstRow }
                    </button>
                </td>
                <td>
                    <p className={ clsx(style.document_date) }>{ moment(item.updatedAt).format('DD.MM.YYYY hh:mm') }</p>
                    {
                        userRole === UserRoleEnum.Client ? null :
                            <Tooltip title="Вернуть" placement={'top'}>
                                <button onClick={ () => UnarchiveHandler(item.id, null) }>
                                    <img src={ UnarchiveIcon } alt="" className={ clsx(style.edit_icon) } />
                                </button>
                            </Tooltip>
                    }
                </td>
            </tr>
        )
    })

    const tableFilesContent = archiveCurrentDocuments[1].map(item => {

        const firstRow = (
            <label htmlFor={ `key` } className={ clsx(tableStyle.column_fixed_height) }>
                <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name=""
                       id={ `key` } />
                <label htmlFor={ `key` }>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </label>
                <svg className={ clsx(style.file_icon) } width="32" height="32" viewBox="0 0 32 32" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C6.9 0 6 0.9 6 2V30C6 31.1 6.9 32 8 32H28C29.1 32 30 31.1 30 30V8L22 0H8Z"
                          fill="#DFE3F1" />
                    <path d="M24 8H30L22 0V6C22 7.1 22.9 8 24 8Z" fill="#B0B7BD" />
                    <path d="M30 14L24 8H30V14Z" fill="#CAD1D8" />
                </svg>
                <label htmlFor={ `key` } className={ clsx(tableStyle.checkbox_label) }>{ item.title }</label>
            </label>
        )

        return (
            <tr key={ item.id }>
                <td>
                    { firstRow }
                </td>
                <td>
                    <p className={ clsx(style.document_date) }>{ moment(item.updatedAt).format('DD.MM.YYYY hh:mm') }</p>
                    {
                        userRole === UserRoleEnum.Client ? null :
                            <Tooltip title="Вернуть" placement={'top'}>
                                <button onClick={ () => UnarchiveHandler(null, item.id) }>
                                    <img src={ UnarchiveIcon } alt="" className={ clsx(style.edit_icon) } />
                                </button>
                            </Tooltip>
                    }
                </td>
            </tr>
        )
    })

    return (
        <div className={ clsx(tableStyle.base_table_container) }>
            {
                isLoading ? <Loader /> : error ? <ErrorIndicator /> :
                    <>
                        <p className={ clsx(style.path_text) }>
                            Путь: / { paths.length > 0 ? paths.map(path => path.title + ' / ') : '' }
                        </p>
                        <table className={ clsx(tableStyle.base_table, style.workspace_table, style.archiveTable) }>
                            <thead>
                            <tr>
                                <td>
                                    <label>
                                        <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden
                                               name=""
                                               disabled />
                                        <label>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M5 13l4 4L19 7" />
                                            </svg>
                                        </label>
                                        <label className={ clsx(tableStyle.checkbox_label) }>Название документа</label>
                                    </label>
                                </td>
                                <td>Дата обновления</td>
                            </tr>
                            </thead>
                            <tbody>
                            { tableDirectoriesContent }
                            { tableFilesContent }
                            </tbody>
                        </table>
                    </>
            }
        </div>
    )
}

export default ArchiveDocumentTable