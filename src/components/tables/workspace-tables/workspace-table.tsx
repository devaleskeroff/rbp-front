import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
import qs from 'qs'
// COMPONENTS
import useModal from '@modals/modal-hook'
import { ErrorIndicator, Loader } from '@ui/indicators'
import { Tooltip } from '@material-ui/core'
import { DocumentViewButton } from '@components/common/common'
// STORE
import {
    $CommonGroupDocuments,
    $WpDirectories,
    $WpDocumentsStates,
    $WpFiles,
    setCommonGroupDocuments,
    setWpDirectories,
    setWpDocumentsError,
    setWpDocumentsLoading,
    setWpFiles
} from '@store/company/workspace-store'
import { $Company } from '@store/company/company-store'
import { pushToArchiveCommonDocuments } from '@store/company/archive-store'
import {$User, UserRoleEnum} from '@store/user-store'
// SERVICES
import WorkspaceService from '@services/workspace-service'
// UTILS
import { GetFileName } from '@utils/rus-to-latin'
// TYPES
import {
    WorkspaceDirectoryShortDataT,
    WorkspaceTablePropsT
} from '@interfaces/company/workspace'
import { ArchiveDirectoryDataT, ArchiveFileT } from '@interfaces/company/archive'
import { CompanyT } from '@interfaces/company/company'
import { UserDataT } from "@interfaces/user";
// ICONS
import EditIcon from '@assets/images/dark-edit.png'
import EditDocumentIcon from '@assets/images/edit-document.png'
import DownloadIcon from '@assets/images/download.png'
import CrossIcon from '@assets/images/cross.png'
import ArchiveIcon from '@assets/images/archive.png'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/company/company-workspace.module.scss'

const WorkspaceTable: React.FC<WorkspaceTablePropsT> = ({ setWithHistory }) => {
    // STORE
    const company = useStore($Company) as CompanyT
    const user = useStore($User) as UserDataT
    const commonWpDocuments = useStore($CommonGroupDocuments)
    const wpDirectories = useStore($WpDirectories)
    const wpFiles = useStore($WpFiles)
    const { isLoading, error } = useStore($WpDocumentsStates)
    // STATE
    const [filters, setFilters] = useState<{ groupId: number, folderId: number }>({ groupId: 0, folderId: 0 })
    const [paths, setPaths] = useState<WorkspaceDirectoryShortDataT[]>([])

    const { open } = useModal()
    const { pathname } = useLocation()
    const history = useHistory()

    useEffect(() => {
        const Querystring = qs.parse(history.location.search, { ignoreQueryPrefix: true })
        const folderId = Querystring?.folder_id
        const groupId = Querystring?.group_id

        if (folderId && +folderId) {
            if (paths.length > 1 && paths[paths.length - 2]?.id === +folderId) {
                paths.pop()
                setPaths(paths)
            } else {
                paths.push(wpDirectories.find(dir => dir.id === +folderId) as WorkspaceDirectoryShortDataT)
            }
        } else {
            setPaths([])
        }

        setFilters({ groupId: +(groupId as string) || 0, folderId: +(folderId as string) || 0 })
    }, [history.location.search])

    useEffect(() => {
        const { groupId, folderId } = filters

        if (folderId === 0) {
            setWithHistory(false)
        }

        if (groupId === 0 && folderId === 0) {
            setWpDirectories(commonWpDocuments[0])
            setWpFiles(commonWpDocuments[1])
            return
        }
        setWpDocumentsLoading(true)

        WorkspaceService.GetWorkspace(groupId, folderId, (err, res) => {
            if (err || !res) {
                return setWpDocumentsError(true)
            }
            setWpDirectories(res.data.directories)
            setWpFiles(res.data.files)
            setWpDocumentsLoading(false)
        })
    }, [filters])

    useEffect(() => {
        const { groupId, folderId } = filters

        if (groupId === 0 && folderId === 0) {
            setWpDirectories(commonWpDocuments[0])
            setWpFiles(commonWpDocuments[1])
        }
    }, [commonWpDocuments])

    // HANDLING DOUBLE CLICK
    const handleDoubleClick = (id: number) => {
        const queryString = qs.parse(history.location.search, { ignoreQueryPrefix: true })

        let newQueryStringObj: any = {
            folder_id: id
        }
        if (queryString.group_id) {
            newQueryStringObj.group_id = queryString.group_id
        }

        setWithHistory(true)
        history.push({
            pathname,
            search: qs.stringify(newQueryStringObj)
        })
    }

    const handleDirectoryDelete = (directoryId: number) => {
        if (!directoryId) {
            return
        }
        WorkspaceService.DeleteDirectory(directoryId, (err, res) => {
            if (err) {
                return console.log('При удалении папки произошла ошибка')
            }
            setWpDirectories(wpDirectories.filter(directory => directory.id !== directoryId))
            return setCommonGroupDocuments([
                commonWpDocuments[0].filter(dir => dir.id !== directoryId),
                commonWpDocuments[1]
            ])
        })
    }

    const handleFileDelete = (fileId: number) => {
        if (!fileId) {
            return
        }
        WorkspaceService.DeleteFile(fileId, (err, res) => {
            if (err) {
                return console.log('При удалении файла произошла ошибка')
            }
            setWpFiles(wpFiles.filter(file => file.id !== fileId))
            return setCommonGroupDocuments([
                commonWpDocuments[0],
                commonWpDocuments[1].filter(file => file.id !== fileId)
            ])
        })
    }

    const sendDirToArchive = (directoryId: number) => {
        WorkspaceService.SendDirToArchive(directoryId, (err, res) => {
            if (err) {
                return console.log('При добавлении папки в архив произошла ошибка')
            }
            const newArchiveDoc = wpDirectories.find(dir => dir.id === directoryId);
            (newArchiveDoc as any).updatedAt = new Date()

            pushToArchiveCommonDocuments([newArchiveDoc as unknown as ArchiveDirectoryDataT, null])

            if (filters.folderId === 0 && filters.groupId === 0) {
                return setCommonGroupDocuments([
                    commonWpDocuments[0].filter(dir => dir.id !== directoryId),
                    commonWpDocuments[1]
                ])
            }
            setWpDirectories(wpDirectories.filter(directory => directory.id !== directoryId))
        })
    }

    const sendFileToArchive = (fileId: number) => {
        WorkspaceService.SendFileToArchive(fileId, (err, res) => {
            if (err) {
                return console.log('При добавлении файла в архив произошла ошибка')
            }
            const newArchiveDoc = wpFiles.find(file => file.id === fileId);
            (newArchiveDoc as any).updatedAt = new Date()

            pushToArchiveCommonDocuments([null, newArchiveDoc as unknown as ArchiveFileT])

            if (filters.folderId === 0 && filters.groupId === 0) {
                return setCommonGroupDocuments([
                    commonWpDocuments[0],
                    commonWpDocuments[1].filter(file => file.id !== fileId)
                ])
            }
            setWpFiles(wpFiles.filter(file => file.id !== fileId))
        })
    }

    const editableInEditor = (extension: string): boolean => {
        switch (extension) {
            case 'xml': case 'xls': case 'xlsx': case 'docx':
                return true
            default: return false
        }
    }

    const tableDirectoriesContent = wpDirectories.map(item => {
        const firstRow = (
            <label htmlFor={ item.title } className={ clsx(tableStyle.column_fixed_height) }>
                <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name=""
                       id={ item.title }/>
                <label htmlFor={ item.title }>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </label>
                <svg className={ clsx(style.file_icon) } viewBox="0 0 36 36" fill="none"
                     xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                    <path
                        d="M0 11.7761V30.3969C0 31.452 0.806906 32.259 1.86209 32.259H34.1379C35.1931 32.259 36 31.452 36 30.3969V11.7761C36 10.721 35.1931 9.91406 34.1379 9.91406H1.86209C0.806906 9.91406 0 10.7831 0 11.7761Z"
                        fill="#F7B84E"/>
                    <path
                        d="M32.8963 9.93103C32.8963 8.56549 31.779 7.44829 30.4135 7.44829H20.4825L17.379 3.72412H3.7239C2.66872 3.72412 1.86182 4.59311 1.86182 5.58621V9.93103H32.8963Z"
                        fill="#E4A12F"/>
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
                    {
                        user.role === UserRoleEnum.Client ? null :
                            <div className={ clsx(style.table_buttons) }>
                                <Tooltip title="Изменить" placement="top">
                                    <button>
                                        <img src={ EditIcon } alt="Изменить" onClick={ () => (
                                            open('CreateFolderModal', {
                                                btnText: 'Сохранить',
                                                modalData: {
                                                    modalTitle: 'Изменить папку',
                                                    itemTitle: item.title,
                                                    item
                                                }
                                            })
                                        ) }/>
                                    </button>
                                </Tooltip>
                                <Tooltip title="В архив" placement="top">
                                    <button>
                                        <img src={ ArchiveIcon } alt="В архив" onClick={ () => sendDirToArchive(item.id) }/>
                                    </button>
                                </Tooltip>
                                <Tooltip title="Удалить" placement="top">
                                    <button>
                                        <img src={ CrossIcon } alt="Удалить" onClick={ () => open('ConfirmActionModal', {
                                            btnText: 'Удалить',
                                            modalData: {
                                                text: `Вы уверены, что хотите удалить папку ${ item.title } и все содержимое?`
                                            },
                                            onConfirm: () => handleDirectoryDelete(item.id)
                                        }) }/>
                                    </button>
                                </Tooltip>
                            </div>
                    }
                </td>
            </tr>
        )
    })

    const tableFilesContent = wpFiles.map(item => {
        const firstRow = (
            <label htmlFor={ item.title } className={ clsx(tableStyle.column_fixed_height) }>
                <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name=""
                       id={ item.title } />
                <label htmlFor={ item.title }>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </label>
                <svg className={ clsx(style.file_icon) } width="32" height="32" viewBox="0 0 32 32" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C6.9 0 6 0.9 6 2V30C6 31.1 6.9 32 8 32H28C29.1 32 30 31.1 30 30V8L22 0H8Z"
                          fill="#DFE3F1"/>
                    <path d="M24 8H30L22 0V6C22 7.1 22.9 8 24 8Z" fill="#B0B7BD"/>
                    <path d="M30 14L24 8H30V14Z" fill="#CAD1D8"/>
                </svg>
                <label htmlFor={ `key` } className={ clsx(tableStyle.checkbox_label) }>{ item.title }</label>
            </label>
        )
        const pathHash = btoa(`${ process.env.API_URL }/api/v1/file/${ item.id }?type=workspace&hash=${ item.hash }`)
        const filename = GetFileName(item.title, item.extension)
        const fullEditorUrl = `${process.env.EDITOR_URL}/?document=${pathHash}&filename=${filename}&from=${user.id}&for=${company.id}`

        return (
            <tr key={ item.id }>
                <td>
                    { firstRow }
                </td>
                <td>
                    <div className={ clsx(style.table_buttons) }>
                        <Tooltip title="Посмотреть" placement="top">
                            <DocumentViewButton file={item} />
                        </Tooltip>
                        {
                            user.role === UserRoleEnum.Client ? null :
                                <>
                                    <Tooltip title="Изменить" placement="top">
                                        <button>
                                            <img src={ EditIcon } alt="Редактировать" onClick={ () => (
                                                open('EditWorkspaceDocumentModal', {
                                                    btnText: 'Сохранить',
                                                    modalData: {
                                                        modalTitle: 'Изменить файл',
                                                        item
                                                    }
                                                })
                                            ) } />
                                        </button>
                                    </Tooltip>
                                    {
                                        editableInEditor(item.extension) ?
                                            <Tooltip title="Редактировать документ" placement="top">
                                                <button>
                                                    <a href={ fullEditorUrl } target={ '_blank' } rel={ 'noreferrer' }>
                                                        <img src={ EditDocumentIcon } alt="Редактировать"
                                                             style={{ width: 19, height: 19, opacity: 0.75 }}
                                                        />
                                                    </a>
                                                </button>
                                            </Tooltip> : null
                                    }
                                </>
                        }
                        <Tooltip title="Скачать" placement="top">
                            <button>
                                <a href={ `${ process.env.API_URL }/api/v1/file/${ item.id }?type=workspace&hash=${ item.hash }` }
                                   target={ '_blank' } rel={ 'noreferrer' } download>
                                    <img src={ DownloadIcon } alt="Скачать"/>
                                </a>
                            </button>
                        </Tooltip>
                        {
                            user.role === UserRoleEnum.Client ? null :
                                <>
                                    <Tooltip title="В архив" placement="top">
                                        <button onClick={ () => sendFileToArchive(item.id) }>
                                            <img src={ ArchiveIcon } alt="В архив"/>
                                        </button>
                                    </Tooltip>
                                    <Tooltip title="Удалить" placement="top">
                                        <button>
                                            <img src={ CrossIcon } alt="Удалить"
                                                 onClick={ () => open('ConfirmActionModal', {
                                                     btnText: 'Удалить',
                                                     modalData: {
                                                         text: `Вы уверены, что хотите удалить файл ${ item.title }?`
                                                     },
                                                     onConfirm: () => handleFileDelete(item.id)
                                                 }) }/>
                                        </button>
                                    </Tooltip>
                                </>
                        }
                    </div>
                </td>
            </tr>
        )
    })

    return (
        <div className={ clsx(tableStyle.base_table_container) }>
            {
                isLoading ? <Loader/> : error ? <ErrorIndicator/> :
                    <>
                        <p className={ clsx(style.path_text) }>
                            Путь: / { paths.length > 0 ? paths.map(path => path.title + ' / ') : '' }
                        </p>
                        <table className={ clsx(tableStyle.base_table, style.workspace_table) }>
                            <thead>
                            <tr>
                                <td>
                                    <label>
                                        <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden
                                               name=""
                                               disabled/>
                                        <label>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M5 13l4 4L19 7"/>
                                            </svg>
                                        </label>
                                        <label className={ clsx(tableStyle.checkbox_label) }>Название документа</label>
                                    </label>
                                </td>
                                <td/>
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

export default WorkspaceTable