import React, { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// HOOKS
import useModal from '@modals/modal-hook'
import useStyles from '@ui/material-ui-styles'
// COMPONENTS
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import { periods } from '@pages/company/workspace'
// STORE
import { $WpFiles, setWpFiles } from '@store/company/workspace-store'
// SERVICE
import WorkspaceService from '@services/workspace-service'
// STYLES
import style from '@scss/modals/company/workspace-document.module.scss'

const EditWorkspaceDocumentModal = () => {
    const wpFiles = useStore($WpFiles)
    const [period, setPeriod] = useState<string>(periods[0].value.toString())

    const { modalComponent, modalData, close } = useModal()
    const classes = useStyles()

    useEffect(() => {
        setPeriod(modalData?.item?.periodicity?.toString() || periods[0].value.toString())
    }, [])

    const handlePeriodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPeriod(event.target.value as string)
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        const titleField = document.querySelector('input[name="title"]') as HTMLInputElement

        if (titleField && modalData?.item?.id) {
            const data = { title: titleField.value, periodicity: +period }

            WorkspaceService.UpdateFile(modalData.item.id, data, (err, res) => {
                if (err || !res) {
                    return console.log('При изменении файла произошла ошибка')
                }

                setWpFiles(wpFiles.map(file => {
                    if (file.id === modalData.item.id) {
                        file.title = titleField.value
                        file.periodicity = +period
                    }
                    return file
                }))
                close()
            })
        }
    }

    return (
        <div className={ clsx(style.workspace_document_modal) }>
            <p className="modal_title">Изменить файл</p>
            <div className="underline" />
            <form className={ `modal_content ${ classes.root }` }
                  onSubmit={ handleSubmit }>
                <TextField label="Название файла" variant="filled" name='title' required defaultValue={modalData?.item?.title} />
                <FormControl variant="filled" className={ clsx(style.period_select) }>
                    <InputLabel id="ot-specialist">Периодичность подписания</InputLabel>
                    <Select
                        labelId="ot-specialist"
                        value={ +period }
                        onChange={ handlePeriodChange }
                    >
                        {
                            periods.map(item => (
                                <MenuItem key={ item.value } value={ item.value }>{ item.label }</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <button type="submit" className="modal_btn">{ modalComponent.btnText }</button>
            </form>
        </div>
    )
}

export default EditWorkspaceDocumentModal