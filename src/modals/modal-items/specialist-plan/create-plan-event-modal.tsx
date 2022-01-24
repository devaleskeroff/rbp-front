import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
// COMPONENTS
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
// HOOKS
import { useModal } from '@modals/index'
import useStyles from '@ui/material-ui-styles'
// STYLES
import modalStyles from '@scss/modals/company/calendar.module.scss'
import style from '@scss/pages/specialist-plan.module.scss'
import SpecialistPlanService from '@services/specialist-plan-service'
import { pushToTasks, updatePlanTask } from '@store/specialist-plan-store'

const PeriodicityItems =[
    { value: 1, label: 'Ежемесячно' },
    { value: 2, label: 'Каждые 3 месяца' },
    { value: 3, label: 'Каждые пол года' },
    { value: 4, label: 'Каждый год' }
]

const CreatePlanEventModal = () => {
    const { modalComponent, modalData, close } = useModal()
    const getDateStart = () => {
        if (modalData.event?.startDate) {
            return new Date(modalData.event.startDate)
        }
        return new Date()
    }
    const getDateFinish = () => {
        if (modalData.event?.deadline) {
            return new Date(modalData.event.deadline)
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
    const [periodicity, setPeriodicity] = useState<number>(PeriodicityItems[0].value)
    const [validation, setValidation] = useState<any>({
        titleError: '',
        descError: '',
        periodicityError: '',
        creationError: ''
    })
    const classes = useStyles()

    useEffect(() => {
        if (modalData.editMode && modalData.event?.periodicity) {
            setPeriodicity(modalData.event.periodicity)
        }
    }, [])

    const handleSubmit = (e: any) => {
        e.preventDefault()

        const titleField = document.querySelector('input[name="title"]') as HTMLInputElement
        const descField = document.querySelector('textarea[name="description"]') as HTMLInputElement

        const invalidPeriodicityValue = !PeriodicityItems.find(item => item.value === periodicity)
        if (!titleField?.value || !descField?.value || invalidPeriodicityValue) {
            return setValidation({
                titleError: !titleField?.value ? 'Это поле обязательно' : '',
                descError: !descField?.value ? 'Это поле обязательно' : '',
                periodicityError: invalidPeriodicityValue ? 'Некорректное значени' : ''
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
            periodicity,
            groupId: modalData.groupId,
            parentId: modalData.parentId || undefined,
            startDate: startDate.getTime(),
            deadline: finishDate.getTime(),
        }

        // UPDATING EVENT
        if (modalData.editMode) {
            eventNewData.parentId = undefined
            eventNewData.groupId = undefined

            SpecialistPlanService.UpdateEvent(modalData.companyId, modalData.event.id, eventNewData, (err, res) => {
                if (err || !res) {
                    return console.log('При изменении задачи произошла ошибка')
                }
                updatePlanTask({ ...modalData.event, ...eventNewData })
            })
            close()
            return
        }
        // CREATING NEW EVENT
        SpecialistPlanService.CreateNewEvent(modalData.companyId, eventNewData, (err, res) => {
            if (err || !res) {
                return console.log('При создании события произошла ошибка')
            }
            pushToTasks(res.data)
            close()
        })
    }

    const onStartDateChange = (date: any) => {
        setStartDateChange(date._d)
    }
    const onStartTimeChange = (date: any) => {
        setStartTimeChange(date._d)
    }

    const onFinishTimeChange = (date: any) => {
        setFinishTimeChange(date._d)
    }

    const onFinishDateChange = (date: any) => {
        setFinishDateChange(date._d)
    }

    const handlePeriodicityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPeriodicity(+(event.target.value as string))
    }

    return (
        <div key={ modalComponent.key } className={ clsx(modalStyles.create_event_modal) }>
            <p className="modal_title">{ modalData.modalTitle }</p>
            <div className="underline"/>
            <form className={ `modal_content ${ classes.root }` } onSubmit={ handleSubmit }>
                <TextField label="Название ивента" name={'title'} variant="filled" required defaultValue={ modalData.event?.title } />
                <p className="error-text">{ validation.titleError }</p>
                <TextField label="Описание" name={'description'} variant="filled" required multiline defaultValue={ modalData.event?.desc } />
                <p className="error-text">{ validation.descError }</p>
                <FormControl variant="filled" className={ clsx(style.period_select) }>
                    <InputLabel id="ot-specialist">Создание задачи</InputLabel>
                    <Select
                        labelId="specialist-plan-periodicity"
                        value={ periodicity }
                        onChange={ handlePeriodicityChange }
                    >
                        {
                            PeriodicityItems.map(item => (
                                <MenuItem key={ item.value } value={ item.value }>{ item.label }</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <p className="error-text">{ validation.periodicityError }</p>
                <div className="create-event-modal-pickers">
                    <p className={ clsx(style.datepickers_title) }>Начало и крайний срок</p>
                    <MuiPickersUtilsProvider libInstance={ moment } utils={ MomentUtils } locale={ 'ru' }>
                        <Grid container className={ clsx(modalStyles.main_pickers_container) }>
                            <Grid item xs={ 12 } md={ 6 }>
                                <Grid container className={ clsx(modalStyles.pickers_container) }>
                                    <Grid item xs={ 12 } sm={ 5 }>
                                        <KeyboardTimePicker
                                            className={ clsx(modalStyles.pickers_input) }
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
                                            className={ clsx(modalStyles.pickers_input) }
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
                                <Grid container className={ clsx(modalStyles.pickers_container) }>
                                    <Grid item xs={ 12 } sm={ 5 }>
                                        <KeyboardTimePicker
                                            className={ clsx(modalStyles.pickers_input) }
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
                                            className={ clsx(modalStyles.pickers_input) }

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

export default CreatePlanEventModal