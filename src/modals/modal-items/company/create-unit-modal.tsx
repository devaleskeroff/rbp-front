import React from 'react'
// HOOKS
import useModal from '@modals/modal-hook'
// COMPONENTS
import { TextField } from '@material-ui/core'
// STORE
import { createNewPosition, createNewUnit, updatePosition, updateUnit } from '@store/company/units-store'
// STYLE
import useStyles from '@ui/material-ui-styles'

const CreateUnitModal = () => {
    const { modalComponent, modalData, close } = useModal()
    const classes = useStyles()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        const titleField = document.querySelector('input[name="title"]') as HTMLInputElement

        // IF NEED TO CREATE & UPDATE UNIT POSITION ( DONT FORGET PUT RETURN INSIDE THE BELOW IF )
        if (modalData.positionMode) {
            if (modalData.editMode) {
                updatePosition({
                    positionId: modalData.position.id,
                    unitId: modalData.unitId,
                    title: titleField.value,
                    cb: (err, res) => {
                        if (err) {
                            return console.log('При изменении должности произошла ошибка')
                        }
                        close()
                    }
                })
            } else {
                createNewPosition({
                    unitId: modalData.unitId,
                    title: titleField.value,
                    cb: (err, res) => {
                        if (err || !res) {
                            return console.log('При добавлении должности произошла ошибка')
                        }
                        close()
                    }
                })
            }
            return
        }

        // IF NEED TO CREATE & UPDATE UNIT
        if (modalData.editMode) {
            updateUnit({
                unitId: modalData.unitId,
                title: titleField.value,
                cb: (err) => {
                    if (err) {
                        return console.log('При изменении подразделения произошла ошибка')
                    }
                    close()
                }
            })
        } else {
            createNewUnit({
                title: titleField.value,
                cb: (err) => {
                    if (err) {
                        return console.log('При создании подразделения произошла ошибка')
                    }
                    close()
                }
            })
        }
    }

    return (
        <div key={ modalComponent.key }>
            <p className="modal_title">{ modalData.modalTitle }</p>
            <div className="underline"/>
            <form className={ `modal_content ${ classes.root }` } onSubmit={ handleSubmit }>
                <TextField label={ modalData.fieldTitle } name={ 'title' }
                           variant="filled" required defaultValue={ modalData.itemValue || '' }/>
                <button type="submit" className="modal_btn">{ modalComponent.btnText }</button>
            </form>
        </div>
    )
}

export default CreateUnitModal