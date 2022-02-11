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
import LegalInformationService from '@services/legal-information-service'
// STORE
import {
    $CommonLegalInformationDocuments,
    $LegalInformationDocuments,
    pushToLegalInformationCommonDocs,
    pushToLegalInformationDocs,
    setLegalInformationCommonDocs,
    setLegalInformationDocuments
} from '@store/legal-information-store'

const CreateLegalInfoFolderModal = () => {
    const legalInfoCommonDocs = useStore($CommonLegalInformationDocuments)
    const legalInfoCurrentDocs = useStore($LegalInformationDocuments)

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

            return LegalInformationService.CreateDirectory({
                title: directoryTitle.value,
                parentId: queryString.folder_id ? +queryString.folder_id : null,
            }, (err, res) => {
                if (err || !res) {
                    return console.log('При создании папки произошла ошибка')
                }
                if (+(queryString.folder_id as string) === 0) {
                    pushToLegalInformationCommonDocs([null, res.data])
                } else {
                    pushToLegalInformationDocs([null, res.data])
                }
                close()
            })
        }

        // UPDATING FOLDER
        if (directoryTitle?.value && modalData?.item?.id) {
            LegalInformationService.UpdateDirectory(modalData.item.id, directoryTitle.value, (err, res) => {
                if (err || !res) {
                    return console.log('При обновлении папки произошла ошибка')
                }
                setLegalInformationCommonDocs([legalInfoCommonDocs[0],
                    legalInfoCommonDocs[1].map(dir => {
                        if (dir.id === modalData.item.id) {
                            dir.title = directoryTitle.value
                        }
                        return dir
                    })
                ])
                setLegalInformationDocuments([legalInfoCurrentDocs[0],
                    legalInfoCurrentDocs[1].map(dir => {
                        if (dir.id === modalData.item.id) {
                            dir.title = directoryTitle.value
                        }
                        return dir
                    })
                ])
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

export default CreateLegalInfoFolderModal