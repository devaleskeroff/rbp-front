import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
// HOOKS
import useModal from '@modals/modal-hook'
import useStyles from '@ui/material-ui-styles'
// STYLE
import style from '@scss/modals/company/calendar.module.scss'
// SERVICE
import EventService from '@services/event-service'
// COMPONENTS
import { TextField, Grid } from '@material-ui/core'
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import moment from 'moment'
import 'moment/locale/ru'

moment.locale('ru')

const CreateEventModal = () => {
    const { modalComponent, modalData, close } = useModal()

    const getDateStart = () => {
        if (modalData.event?.dateStart) {
            return new Date(modalData.event.dateStart)
        }
        return new Date()
    }

    const getDateFinish = () => {
        if (modalData.event?.dateFinish) {
            return new Date(modalData.event.dateFinish)
        }
        return new Date()
    }
    // START DATE
    const [selectedStartDate, setStartDateChange] = useState(getDateStart)
    const [selectedStartTime, setStartTimeChange] = useState(getDateStart)
    // FINISH DATE
    const [selectedFinishDate, setFinishDateChange] = useState(getDateFinish)
    const [selectedFinishTime, setFinishTimeChange] = useState(getDateFinish)
    // OTHER STATES
    const [validation, setValidation] = useState<any>({
        titleError: '',
        descError: '',
        creationError: ''
    })
    const classes = useStyles()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        const titleField = document.querySelector('input[name="title"]') as HTMLInputElement
        const descField = document.querySelector('textarea[name="description"]') as HTMLInputElement

        if (!titleField?.value || !descField?.value) {
            return setValidation({
                titleError: !titleField?.value ? 'Это поле обязательно' : '',
                descError: !descField?.value ? 'Это поле обязательно' : ''
            })
        }
        const startDate = new Date(
            selectedStartDate.getFullYear(),
            selectedStartDate.getMonth(),
            selectedStartDate.getDate(),
            selectedStartTime.getHours(),
            selectedStartTime.getMinutes()
        )
        const finishDate = new Date(
            selectedFinishDate.getFullYear(),
            selectedFinishDate.getMonth(),
            selectedFinishDate.getDate(),
            selectedFinishTime.getHours(),
            selectedFinishTime.getMinutes()
        )

        const eventNewData = {
            title: titleField.value,
            desc: descField.value,
            dateStart: startDate.getTime(),
            dateFinish: finishDate.getTime(),
        }

        // UPDATING EVENT
        if (modalData.event) {
            return EventService.UpdateEvent(modalData.event.id, eventNewData, (err, res) => {
                if (err) {
                    return setValidation({ creationError: 'При создании ивента произошла ошибка' })
                }
                if (modalComponent.onConfirm) {
                    modalComponent.onConfirm({ ...modalData.event, ...eventNewData })
                }
                close()
            })
        }

        // CREATING NEW EVENT
        EventService.CreateEvent(eventNewData, (err, res) => {
            if (err || !res) {
                return setValidation({ creationError: 'При создании ивента произошла ошибка' })
            }
            if (modalComponent.onConfirm) {
                modalComponent.onConfirm(res.data)
            }
            close()
        })
    }

    const onStartDateChange = (date: any, value?: string | null) => {
        setStartDateChange(date._d)
    }
    const onStartTimeChange = (date: any, value?: string | null) => {
        setStartTimeChange(date._d)
    }

    const onFinishTimeChange = (date: any, value?: string | null) => {
        setFinishTimeChange(date._d)
    }

    const onFinishDateChange = (date: any, value?: string | null) => {
        setFinishDateChange(date._d)
    }

    return (
        <div key={ modalComponent.key } className={ clsx(style.create_event_modal) }>
            <p className="modal_title">{ modalData.modalTitle }</p>
            <div className="underline"/>
            <form className={ `modal_content ${ classes.root }` } onSubmit={ handleSubmit }>
                <TextField label="Название ивента" name={'title'} variant="filled" required defaultValue={ modalData.event?.title } />
                <p className="error-text">{ validation.titleError }</p>
                <TextField label="Описание" name={'description'} variant="filled" required multiline defaultValue={ modalData.event?.desc } />
                <p className="error-text">{ validation.descError }</p>
                <div className="create-event-modal-pickers">
                    <MuiPickersUtilsProvider libInstance={ moment } utils={ MomentUtils } locale={ 'ru' }>
                        <Grid container className={ clsx(style.main_pickers_container) }>
                            <Grid item xs={ 12 } md={ 6 }>
                                <p>Начало ивента</p>
                                <Grid container className={ clsx(style.pickers_container) }>
                                    <Grid item xs={ 12 } sm={ 5 }>
                                        <KeyboardTimePicker
                                            className={ clsx(style.pickers_input) }
                                            format="HH:mm"
                                            ampm={ false }
                                            margin="normal"
                                            id="time-picker"
                                            label="Время"
                                            value={ selectedStartTime }
                                            onChange={ onStartTimeChange }
                                            KeyboardButtonProps={ {
                                                'aria-label': 'change time'
                                            } }
                                        />
                                    </Grid>
                                    <Grid item xs={ 12 } sm={ 6 }>
                                        <KeyboardDatePicker
                                            className={ clsx(style.pickers_input) }
                                            disableToolbar
                                            variant="dialog"
                                            format="DD.MM.yyyy"
                                            margin="normal"
                                            label="Дата"
                                            value={ selectedStartDate }
                                            onChange={ onStartDateChange }
                                            KeyboardButtonProps={ {
                                                'aria-label': 'change date'
                                            } }
                                            onError={ console.log }
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={ 12 } md={ 6 }>
                                <p>Окончание ивента</p>
                                <Grid container className={ clsx(style.pickers_container) }>
                                    <Grid item xs={ 12 } sm={ 5 }>
                                        <KeyboardTimePicker
                                            className={ clsx(style.pickers_input) }
                                            format="HH:mm"
                                            ampm={ false }
                                            margin="normal"
                                            id="time-picker"
                                            label="Время"
                                            value={ selectedFinishTime }
                                            onChange={ onFinishTimeChange }
                                            KeyboardButtonProps={ {
                                                'aria-label': 'change time'
                                            } }
                                        />
                                    </Grid>
                                    <Grid item xs={ 12 } sm={ 6 }>
                                        <KeyboardDatePicker
                                            className={ clsx(style.pickers_input) }

                                            disableToolbar
                                            variant="dialog"
                                            format="DD.MM.yyyy"

                                            margin="normal"
                                            label="Дата"
                                            value={ selectedFinishDate }
                                            onChange={ onFinishDateChange }
                                            KeyboardButtonProps={ {
                                                'aria-label': 'change date'
                                            } }
                                            onError={ console.log }
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>
                <button type="submit" className="modal_btn">{ modalComponent.btnText }</button>
            </form>
        </div>
    )
}

export default CreateEventModal