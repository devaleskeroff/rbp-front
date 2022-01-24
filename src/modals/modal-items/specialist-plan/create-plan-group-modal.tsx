import React from 'react'
// COMPONENTS
import { TextField } from '@material-ui/core'
// HOOKS
import { useModal } from '@modals/index'
import useStyles from '@ui/material-ui-styles'
// SERVICE
import SpecialistPlanService from '@services/specialist-plan-service'
// STORE
import { pushToPlans, updatePlanGroup } from '@store/specialist-plan-store'

const CreatePlanGroupModal = () => {
    const { modalComponent, modalData, close } = useModal()
    const classes = useStyles()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const titleField = document.querySelector('input[name="groupTitle"]') as HTMLInputElement

        if (!titleField || !titleField.value) return

        // UPDATING GROUP
        if (modalData.editMode) {
            if (!modalData.itemId) {
                throw new Error('Отсутствует идентфикатор для редактирования данных')
            }
            SpecialistPlanService.UpdateGroup(modalData.companyId, modalData.itemId, titleField.value, (err, res) => {
                if (err || !res) {
                    return console.log('При изменении данных группы произошла ошибка')
                }
                updatePlanGroup({ id: modalData.itemId, title: titleField.value })
                close()
            })
            return
        }
        // CREATING GROUP
        SpecialistPlanService.CreateGroup(modalData.companyId, titleField.value, (err, res) => {
            if (err || !res) {
                return console.log('При создании группы произошла ошибка')
            }
            pushToPlans([{ ...res.data, tasks: [] }])
        })

        close()
    }

    return (
        <div key={ modalComponent.key }>
            <p className="modal_title">{ modalData.modalTitle }</p>
            <div className="underline" />
            <form className={ `modal_content ${ classes.root }` } onSubmit={ handleSubmit }>
                <TextField label={ 'Название группы' } name={ 'groupTitle' }
                           variant="filled" required defaultValue={ modalData.itemTitle } />
                <button type="submit" className="modal_btn">{ modalComponent.btnText }</button>
            </form>
        </div>
    )
}

export default CreatePlanGroupModal