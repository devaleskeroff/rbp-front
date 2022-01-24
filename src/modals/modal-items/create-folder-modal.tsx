import React from 'react'
import { useStore } from 'effector-react'
import qs from 'qs'
// HOOKS
import useModal from '@modals/modal-hook'
import useStyles from '@ui/material-ui-styles'
import { useHistory } from 'react-router-dom'
// COMPONENTS
import { TextField } from '@material-ui/core'
// SERVICES
import WorkspaceService from '@services/workspace-service'
// STORE
import { $WpDirectories, setWpDirectories } from '@store/company/workspace-store'
import ResponsibilityService from '@services/responsibility-service'
import {
    $CommonResponsibilityDocuments, $ResponsibilityDocuments,
    pushToResponsibilityCommonDocs,
    pushToResponsibilityDocs,
    setResponsibilityCommonDocs, setResponsibilityDocuments
} from '@store/responsibility-store'

const CreateFolderModal = () => {
    const wpDirectories = useStore($WpDirectories)
    const responsibilityCommonDocs = useStore($CommonResponsibilityDocuments)
    const responsibilityCurrentDocs = useStore($ResponsibilityDocuments)

    const { modalComponent, modalData, close } = useModal()
    const classes = useStyles()
    const history = useHistory()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const directoryTitle = document.querySelector('input[name="directoryTitle"]') as HTMLInputElement
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        // CREATING FOLDER
        if (directoryTitle?.value && !modalData?.item?.id) {
            const queryString = qs.parse(history.location.search, { ignoreQueryPrefix: true })

            if (modalData.responsibilityMode) {
                return ResponsibilityService.CreateDirectory({
                    title: directoryTitle.value,
                    parentId: queryString.folder_id ? +queryString.folder_id : null,
                }, (err, res) => {
                    if (err || !res) {
                        return console.log('При создании папки произошла ошибка')
                    }
                    if (+(queryString.folder_id as string) === 0) {
                        pushToResponsibilityCommonDocs([null, res.data])
                    } else {
                        pushToResponsibilityDocs([null, res.data])
                    }
                    close()
                })
            }

            return WorkspaceService.CreateDirectory({
                title: directoryTitle.value,
                parentId: queryString.folder_id ? +queryString.folder_id : null,
                groupId: modalData.groupId
            }, (err, res) => {

                if (err || !res) {
                    return console.log('При создании папки произошла ошибка')
                }
                wpDirectories.push(res.data)
                setWpDirectories([ ...wpDirectories ])
                close()
            })
        }

        // UPDATING FOLDER
        if (directoryTitle?.value && modalData?.item?.id) {
            if (modalData.responsibilityMode) {
                ResponsibilityService.UpdateDirectory(modalData.item.id, directoryTitle.value, (err, res) => {
                    if (err || !res) {
                        return console.log('При обновлении папки произошла ошибка')
                    }
                    setResponsibilityCommonDocs([responsibilityCommonDocs[0],
                        responsibilityCommonDocs[1].map(dir => {
                            if (dir.id === modalData.item.id) {
                                dir.title = directoryTitle.value
                            }
                            return dir
                        })
                    ])
                    setResponsibilityDocuments([responsibilityCurrentDocs[0],
                        responsibilityCurrentDocs[1].map(dir => {
                            if (dir.id === modalData.item.id) {
                                dir.title = directoryTitle.value
                            }
                            return dir
                        })
                    ])
                    close()
                })
                return
            }

            WorkspaceService.UpdateDirectory(modalData.item.id, directoryTitle.value, (err, res) => {
                if (err || !res) {
                    return console.log('При обновлении папки произошла ошибка')
                }

                const newWpDirectories = wpDirectories.map(directory => {
                    if (directory.id === modalData.item.id) {
                        directory.title = directoryTitle.value
                    }
                    return directory
                })
                setWpDirectories(newWpDirectories)
                close()
            })
        }
    }

    return (
        <div key={ modalComponent.key }>
            <p className="modal_title">{ modalData.modalTitle }</p>
            <div className="underline" />
            <form className={ `modal_content ${ classes.root }` } onSubmit={ handleSubmit }>
                <TextField label={ 'Название папки' } name={'directoryTitle'}
                           variant="filled" required defaultValue={ modalData.itemTitle } />
                <button type="submit" className="modal_btn">
                    { modalComponent.btnText }
                </button>
            </form>
        </div>
    )
}

export default CreateFolderModal