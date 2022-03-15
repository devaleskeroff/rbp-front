import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
import qs from 'qs'
// COMPONENTS
import useModal from '@modals/modal-hook'
import Loader from '@ui/indicators/loader'
import moment from 'moment'
import { Tooltip } from '@material-ui/core'
import { ErrorIndicator } from '@ui/indicators'
// ICONS
import DownloadIcon from '@assets/images/download.png'
import EditIcon from '@assets/images/dark-edit.png'
import DeleteIcon from '@assets/images/delete.png'
// SERVICE
import LegalInformationService from '@services/legal-information-service'
// UTILS
import { DocumentViewButton } from '@components/common/common'
// STORE
import { $UserAddPermissions, UserRoleEnum } from '@store/user-store'
// TYPES
import { ResponsibilityDirectoryT, ResponsibilityFileT, ResponsibilityTablePropsT } from '@interfaces/responsibility'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/responsibility.module.scss'
import {
    $CommonLegalInformationDocuments,
    $LegalInformationDocuments,
    $LegalInformationStates,
    setLegalInformationCommonDocs,
    setLegalInformationDocuments,
    setLegalInformationError,
    setLegalInformationLoading, setLegalInformationStates
} from '@store/legal-information-store'

const LegalInformationTable: React.FC<ResponsibilityTablePropsT> = ({ setWithHistory, sort }) => {
    // STORES
    const commonDocuments = useStore($CommonLegalInformationDocuments)
    const currentDocuments = useStore($LegalInformationDocuments)
    const { isFetched, isLoading, error } = useStore($LegalInformationStates)
    const permissions = useStore($UserAddPermissions)
    // STATES
    const [directoryId, setDirectoryId] = useState<number>(0)

    const { pathname } = useLocation()
    const history = useHistory()
    const { open, close } = useModal()

    useEffect(() => {
        const folderId = qs.parse(history.location.search, { ignoreQueryPrefix: true })?.folder_id
        if (+(folderId as string) > 0) {
            setWithHistory(true)
        } else {
            setWithHistory(false)
        }

        setDirectoryId(+(folderId as string) || 0)
    }, [history.location.search])

    useEffect(() => {
        setLegalInformationLoading(true)
        if (directoryId !== 0) {
            LegalInformationService.GetResponsibilityDocuments(directoryId, (err, res) => {
                if (err || !res) {
                    return setLegalInformationError(true)
                }
                setLegalInformationDocuments(sortDocuments([res.data.files, res.data.directories]))
                setLegalInformationLoading(false)
            })
            return
        }
        if (directoryId === 0 && !isFetched) {
            LegalInformationService.GetResponsibilityDocuments(directoryId, (err, res) => {
                if (err || !res) {
                    return setLegalInformationError(true)
                }
                setLegalInformationCommonDocs([res.data.files, res.data.directories])
                setLegalInformationStates({ error, isLoading: false, isFetched: true })
            })
            return
        }
        setLegalInformationDocuments(sortDocuments(commonDocuments))
        setLegalInformationLoading(false)
    }, [directoryId])

    useEffect(() => {
        if (directoryId === 0) {
            setLegalInformationDocuments(sortDocuments(commonDocuments))
        }
    }, [commonDocuments])

    useEffect(() => {
        setLegalInformationDocuments(sortDocuments(currentDocuments))
    }, [sort])

    // HANDLING DOUBLE CLICK
    const handleDoubleClick = (id: number) => {
        const queryString = qs.parse(history.location.search, { ignoreQueryPrefix: true })

        let newQueryStringObj: any = {
            folder_id: id,
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

    const sortDocuments = (documents: [ResponsibilityFileT[], ResponsibilityDirectoryT[]]) => {
        if (sort === 10) {
            documents.forEach(docs => {
                docs.sort((doc1, doc2) => {
                    return new Date(doc2.updatedAt).getTime() - new Date(doc1.updatedAt).getTime()
                })
            })
        } else if (sort === 20) {
            documents.forEach(docs => {
                docs.sort((doc1, doc2) => {
                    return new Date(doc1.updatedAt).getTime() - new Date(doc2.updatedAt).getTime()
                })
            })
        }
        return Array.from(documents) as [ResponsibilityFileT[], ResponsibilityDirectoryT[]]
    }

    const handleDirectoryDelete = (folderId: number) => {
        LegalInformationService.DeleteDirectory(folderId, (err, _res) => {
            if (err) {
                return console.log('При удалении папки произошла ошибка')
            }
            if (directoryId === 0) {
                setLegalInformationCommonDocs([commonDocuments[0], commonDocuments[1].filter(dir => dir.id !== folderId)])
            } else {
                setLegalInformationDocuments(sortDocuments([currentDocuments[0], currentDocuments[1].filter(dir => dir.id !== folderId)]))
            }
            close()
        })
    }

    const handleFileDelete = (id: number) => {
        return LegalInformationService.DeleteFile(id, (err, _res) => {
            if (err) {
                return console.log('При удалении файла произошла ошибка')
            }
            if (directoryId === 0) {
                setLegalInformationCommonDocs([commonDocuments[0].filter(file => file.id !== id), commonDocuments[1]])
            } else {
                setLegalInformationDocuments(sortDocuments([currentDocuments[0].filter(file => file.id !== id), currentDocuments[1]]))
            }
            close()
        })
    }

    const tableDirectoriesContent = currentDocuments[1].map(directory => {
        const firstRow = (
            <label htmlFor={`key`} className={ clsx(tableStyle.column_fixed_height) }>
                <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name="" id={`key`} />
                <label htmlFor={`key`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </label>
                <svg className={ clsx(style.file_icon) } viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                    <path d="M0 11.7761V30.3969C0 31.452 0.806906 32.259 1.86209 32.259H34.1379C35.1931 32.259 36 31.452 36 30.3969V11.7761C36 10.721 35.1931 9.91406 34.1379 9.91406H1.86209C0.806906 9.91406 0 10.7831 0 11.7761Z" fill="#F7B84E" />
                    <path d="M32.8963 9.93103C32.8963 8.56549 31.779 7.44829 30.4135 7.44829H20.4825L17.379 3.72412H3.7239C2.66872 3.72412 1.86182 4.59311 1.86182 5.58621V9.93103H32.8963Z" fill="#E4A12F" />
                </svg>
                <label htmlFor={`key`} className={ clsx(tableStyle.checkbox_label) }>{ directory.title }</label>
            </label>
        )

        return (
            <tr key={directory.id}>
                <td>
                    <button className={ clsx(style.folder) }
                            onDoubleClick={() => handleDoubleClick(directory.id)}>
                        { firstRow }
                    </button>
                </td>
                <td>
                    <div className={ clsx(style.action_col) }>
                        <span>{ moment(directory.updatedAt).format('DD.MM.YYYY hh:mm') }</span>
                        <div className={ clsx(style.action_buttons) }>
                            {
                                permissions.roleIsNotIn([UserRoleEnum.SuperAdmin]) ? null :
                                    <>
                                        <Tooltip title={'Изменить'} placement='top'>
                                            <img src={ EditIcon } alt="Изменить" onClick={ () => (
                                                open('CreateFolderModal', {
                                                    btnText: 'Сохранить',
                                                    modalData: {
                                                        modalTitle: 'Изменить папку',
                                                        responsibilityMode: true,
                                                        itemTitle: directory.title,
                                                        item: directory
                                                    }
                                                })
                                            ) } />
                                        </Tooltip>
                                        <Tooltip title={'Удалить'} placement='top'>
                                            <img src={ DeleteIcon } alt="Удалить" onClick={ () => open('ConfirmActionModal', {
                                                btnText: 'Удалить',
                                                modalData: {
                                                    text: `Вы уверены, что хотите удалить папку "${ directory.title }" и все содержимое?`
                                                },
                                                onConfirm: () => handleDirectoryDelete(directory.id)
                                            }) } />
                                        </Tooltip>
                                    </>
                            }
                        </div>
                    </div>
                </td>
            </tr>
        )
    })

    const tableFilesContent = currentDocuments[0].map(file => {
        const firstRow = (
            <label htmlFor={`key`} className={ clsx(tableStyle.column_fixed_height) }>
                <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name="" id={`key`} />
                <label htmlFor={`key`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </label>
                <svg className={ clsx(style.file_icon) } width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C6.9 0 6 0.9 6 2V30C6 31.1 6.9 32 8 32H28C29.1 32 30 31.1 30 30V8L22 0H8Z" fill="#DFE3F1" />
                    <path d="M24 8H30L22 0V6C22 7.1 22.9 8 24 8Z" fill="#B0B7BD" />
                    <path d="M30 14L24 8H30V14Z" fill="#CAD1D8" />
                </svg>
                <label htmlFor={`key`} className={ clsx(tableStyle.checkbox_label) }>{ file.title }</label>
            </label>
        )

        return (
            <tr key={file.id}>
                <td>{ firstRow }</td>
                <td>
                    <div className={ clsx(style.action_col) }>
                        <span>{ moment(file.updatedAt).format('DD.MM.YYYY') }</span>
                        <div className={ clsx(style.action_buttons) }>
                            <Tooltip title="Посмотреть" placement="top">
                                <DocumentViewButton file={file} type={'document'} />
                            </Tooltip>
                            {
                                permissions.roleIsNotIn([UserRoleEnum.SuperAdmin]) ? null :
                                    <Tooltip title={'Изменить'} placement='top'>
                                        <img src={ EditIcon } alt="Изменить" onClick={ () => (
                                            open('UploadLegalInformationModal', {
                                                btnText: 'Сохранить',
                                                modalData: {
                                                    modalTitle: 'Изменить файл',
                                                    editMode: true,
                                                    file
                                                }
                                            })
                                        ) } />
                                    </Tooltip>
                            }
                            <Tooltip title="Скачать" placement="top">
                                <button>
                                    <a href={ `${ process.env.API_URL }/api/v1/file/${ file.id }?type=document&hash=${ file.hash }` }
                                       target={ '_blank' } rel={ 'noreferrer' } download>
                                        <img src={ DownloadIcon } alt="Скачать"/>
                                    </a>
                                </button>
                            </Tooltip>
                            {
                                permissions.roleIsNotIn([UserRoleEnum.SuperAdmin]) ? null :
                                    <Tooltip title={'Удалить'} placement='top'>
                                        <img src={ DeleteIcon } alt="Удалить" onClick={ () => open('ConfirmActionModal', {
                                            btnText: 'Удалить',
                                            modalData: {
                                                text: `Вы уверены, что хотите удалить файл "${ file.title }"?`
                                            },
                                            onConfirm: () => handleFileDelete(file.id)
                                        }) } />
                                    </Tooltip>
                            }
                        </div>
                    </div>
                </td>
            </tr>
        )
    })

    return (
        <div className={ clsx(tableStyle.base_table_container) }>
            {
                error ? <ErrorIndicator /> : isLoading ? <Loader /> :
                    <table className={ clsx(tableStyle.base_table, style.responsibility_table) }>
                        <thead>
                        <tr>
                            <td>
                                <label>
                                    <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden name="" disabled />
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
                            <td>Дата обновления</td>
                        </tr>
                        </thead>
                        <tbody>
                        { tableDirectoriesContent }
                        { tableFilesContent }
                        </tbody>
                    </table>
            }
        </div>
    )
}

export default LegalInformationTable
