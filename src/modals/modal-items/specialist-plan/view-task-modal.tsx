import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
// COMPONENTS
import moment from 'moment'
import TaskHistoryTable from '@components/tables/specialist-list/task-history-table'
import { ErrorIndicator, Loader } from '@ui/indicators'
// HOOKS
import { useModal } from '@modals/index'
// SERVICE
import SpecialistPlanService from '@services/specialist-plan-service'
// STORE
import { updatePlanTask } from '@store/specialist-plan-store'
// TYPES
import { TaskChangeHistoryT } from '@interfaces/specialist-plan'
// STYLE
import style from '@scss/pages/specialist-plan.module.scss'
import tableStyle from '@scss/components/tables/base-table.module.scss'

const ViewTaskModal = () => {
    const { modalComponent, modalData, close } = useModal()
    const [history, setHistory] = useState<TaskChangeHistoryT[]>([])
    const [taskStatus, setTaskStatus] = useState<number>(modalData.task.status)
    const [historyStates, setHistoryStates] = useState({
        error: false,
        isFetching: true
    })

    useEffect(() => {
        if (modalData.task?.id) {
            SpecialistPlanService.GetChangeHistory(modalData.task.id, (err, res) => {
                if (err || !res) {
                    return setHistoryStates({ error: true, isFetching: false })
                }
                setHistory(res.data)
                setHistoryStates({ error: false, isFetching: false })
            })
        }
    }, [])

    const handleCompleteChange = (e: React.ChangeEvent<HTMLInputElement>, taskId: number, cb: (error: string | null) => void) => {
        SpecialistPlanService.ChangeTaskStatus(taskId, e.target.checked, (err, res) => {
            if (err || !res?.data) {
                return cb('При изменении статуса задачи произошла ошибка')
            }
            cb(null)
        })
    }

    useEffect(() => {
        updatePlanTask({ ...modalData.task, status: taskStatus })
    }, [taskStatus])

    return (
        <div key={ modalComponent.key } className={ clsx(style.view_task_modal) }>
            <p className="modal_title">{ modalData.task.title }</p>
            <div className="underline" />
            <div className="modal_content">
                <label htmlFor="task-status" style={ { display: 'flex', paddingTop: '16px' } }>
                    <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } id={ 'task-status' }
                           checked={ !!taskStatus } hidden
                           onChange={ e => {
                               handleCompleteChange(e, modalData.task.id, (err) => {
                                   if (!err) {
                                       setTaskStatus(e.target.checked ? 0 : 1)
                                       modalData.task.status = e.target.checked ? 0 : 1
                                   }
                               })
                           } } />
                    <label htmlFor="task-status">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </label>
                    <label htmlFor="task-status" className={ clsx(tableStyle.checkbox_label) }>
                        { taskStatus ? 'Выполнена' : 'Не выполнена' }
                    </label>
                </label>
                <p className={ clsx(style.view_task_date) }>
                    { moment(modalData.task.startDate).format('llll') } -&nbsp;
                    { moment(modalData.task.deadline).format('llll') }
                </p>
                <p className={ clsx(style.view_task_desc) }>{ modalData.task.desc }</p>
                <p className={ clsx(style.history_title) }>История изменений</p>
            </div>
            {/* HISTORY TABLE */ }
            {
                historyStates.error ? <ErrorIndicator /> : historyStates.isFetching ? <Loader /> :
                    <TaskHistoryTable history={ history } />
            }
            <div className="modal_content">
                <button type="submit" className="modal_btn colorful-btn" onClick={ close }>Закрыть</button>
            </div>
        </div>
    )
}

export default ViewTaskModal