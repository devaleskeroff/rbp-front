import React from 'react'
import { useStore } from 'effector-react'
// HOOKS
import useModal from '@modals/modal-hook'
import useStyles from '@ui/material-ui-styles'
// COMPONENTS
import { TextField } from '@material-ui/core'
// STORE
import { $WpGroups, setWpGroups } from '@store/company/workspace-store'
// SERVICES
import WorkspaceService from '@services/workspace-service'

const CreateWorkspaceGroupModal = () => {
    const wpGroups = useStore($WpGroups)
    const { modalComponent, modalData, close } = useModal()
    const classes = useStyles()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        const groupTitle = document.querySelector('input[name="groupTitle"]') as HTMLInputElement

        // CREATING NEW GROUP
        if (groupTitle?.value && !modalData.editMode) {
            WorkspaceService.CreateGroup(groupTitle.value, (err, res) => {
                if (err || !res) {
                    return console.log('При создании группы произошла ошибка')
                }
                wpGroups.push(res.data)
                setWpGroups([ ...wpGroups ])
                close()

                if (modalData.onConfirm) {
                    modalData.onConfirm()
                }
            })
        }

        // UPDATING GROUP
        if (groupTitle?.value && modalData.editMode) {
            WorkspaceService.UpdateGroup(modalData.groupId, groupTitle.value, (err, res) => {
                if (err || !res) {
                    return console.log('При создании группы произошла ошибка')
                }

                const newWpGroups = wpGroups.map(group => {
                    if (group.id === modalData.groupId) {
                        group.title = res.data.title
                    }
                    return group
                })
                setWpGroups(newWpGroups)
                close()
            })
        }
    }

    const handleDelete = () => {
        if (modalData.groupId) {
            WorkspaceService.DeleteGroup(modalData.groupId, (err, res) => {
                if (err || !res) {
                    return console.log('При удалении группы произошла ошибка')
                }
                const updatedGroups = wpGroups.filter(group => group.id !== modalData.groupId)
                setWpGroups(updatedGroups)
                close()
            })
        }
    }

    return (
        <div key={ modalComponent.key }>
            <p className="modal_title">{ modalData.modalTitle }</p>
            <div className="underline" />
            <form className={ `modal_content ${ classes.root }` } onSubmit={ handleSubmit }>
                <TextField label={ 'Название группы' } name={'groupTitle'}
                           variant="filled" required defaultValue={ modalData.itemTitle } />
                {
                    modalData.editMode ?
                        <div className="modal_buttons_group">
                            <button type="submit" className="modal_btn">{ modalComponent.btnText }</button>
                            <button type="button" className="modal_btn" onClick={ handleDelete }>Удалить</button>
                        </div>
                        : <button type="submit" className="modal_btn">{ modalComponent.btnText }</button>
                }
            </form>
        </div>
    )
}

export default CreateWorkspaceGroupModal