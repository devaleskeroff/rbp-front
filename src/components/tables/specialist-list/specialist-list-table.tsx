import React, { ChangeEvent, useCallback, useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { useModal } from '@modals/index'
import { Tooltip } from '@material-ui/core'
import { ColorfulButton } from '@components/common/common'
import moment from 'moment'
// SERVICES
import EventService from '@services/event-service'
import SpecialistPlanService from '@services/specialist-plan-service'
// STORE
import { pushToMonthEventsData, setNotificationEvents } from '@store/company/event-store'
import { $SpecialistPlans, removeGroup, removeTask } from '@store/specialist-plan-store'
// UTILS
import { getTextExcerpt } from '@utils/common-utils'
// TYPES
import { PlanTaskDataT, SelectedTasksStateT } from '@interfaces/specialist-plan'
// ICONS
import EditIcon from '@assets/images/dark-edit.png'
import DeleteIcon from '@assets/images/delete.png'
import CalendarIcon from '@assets/images/calendar.png'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/specialist-plan.module.scss'

const SpecialistListTable: React.FC<{ companyId: number, search: string }> = ({ companyId, search }) => {
    // STORES
    const { rows } = useStore($SpecialistPlans)
    // STATES
    const [openTasks, setOpenTasks] = useState<SelectedTasksStateT>({})
    const { open } = useModal()

    const handleTaskOpening = (e: ChangeEvent<HTMLInputElement>) => {
        const taskId = e.target.id
        let subtasks = openTasks[taskId]?.subtasks || {}

        if (openTasks[taskId]?.display) {
            for (let key in subtasks) {
                const checkbox = document.querySelector(`input#${key}`) as HTMLInputElement
                checkbox.checked = false
            }
            subtasks = {}
        }

        setOpenTasks({
            ...openTasks,
            [taskId]: {
                display: !openTasks[taskId]?.display,
                subtasks
            }
        })
    }

    const handleSubtaskOpening = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
        const subtaskId = e.target.id
        const task = openTasks[taskId]

        setOpenTasks({
            ...openTasks,
            [taskId]: {
                display: task.display,
                subtasks: {
                    ...task.subtasks,
                    [subtaskId]: !task.subtasks[subtaskId]
                }
            }
        })
    }

    const handleCompleteChange = (e: React.ChangeEvent<HTMLInputElement>, taskId: number) => {
        SpecialistPlanService.ChangeTaskStatus(taskId, !e.target.checked, (err, res) => {
            if (err || !res?.data) {
                throw new Error('?????? ?????????????????? ?????????????? ???????????? ?????????????????? ????????????')
            }
        })
    }

    const handleGroupDeleting = (groupId: number) => {
        SpecialistPlanService.DeleteGroup(companyId, groupId, (err, res) => {
            if (err || !res) {
                return console.log('?????? ???????????????? ???????????? ?????????????????? ????????????')
            }
            if (res.data === 1) {
                removeGroup(groupId)
            }
        })
    }

    const handleTaskDeleting = (taskId: number, groupId: number) => {
        SpecialistPlanService.DeleteTask(companyId, taskId, groupId, (err, res) => {
            if (err || !res) {
                return console.log('?????? ???????????????? ???????????? ?????????????????? ????????????')
            }
            if (res.data === 1) {
                removeTask(taskId)
            }
        })
    }

    const handleSavingTaskToCalendar = (task: PlanTaskDataT) => {
        EventService.CreateEvent({
            title: task.title,
            desc: task.desc,
            dateStart: task.startDate,
            dateFinish: task.deadline
        }, (err, res) => {
            if (err || !res) {
                return console.log('?????? ???????????????????? ???????????? ?? ?????????????????? ?????????????????? ????????????')
            }
            pushToMonthEventsData([res.data])

            const currentDate = new Date()
            const startDate = new Date(task.startDate)
            const finishDate = new Date(task.deadline)

            if ((currentDate.getDate() === startDate.getDate()
                    && currentDate.getMonth() === startDate.getMonth()
                    && currentDate.getFullYear() === startDate.getFullYear())
                || (currentDate.getDate() === finishDate.getDate()
                    && currentDate.getMonth() === finishDate.getMonth()
                    && currentDate.getFullYear() === finishDate.getFullYear())
            ) {
                setNotificationEvents([res.data])
            }
            if (!task.savedToCalendar) {
                SpecialistPlanService.ChangeSavedStatus(task.id, (err, res) => {
                    if (err || !res) {
                        return console.log('?????? ?????????????????? ?????????????????? ???????????????????? ?? ?????????????????? ?????????????????? ????????????')
                    }
                    task.savedToCalendar = 1
                })
            }
            open('NotificationModal', {
                modalData: {
                    modalTitle: '???????????????? ????????????',
                    text: '?????????? ???? ???????????? ?????????????? ????????????'
                }
            })
        })
    }

    const tableBody = useCallback(() => rows.map(group => {
        const groupFirstRow = group.tasks.length === 0 ? (
                <label htmlFor={ `disclosed_${ group.id }` } className={ clsx(tableStyle.column_fixed_height) }>
                    <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled />
                    <label htmlFor={ `disclosed_${ group.id }` }>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </label>
                    <label htmlFor={ `disclosed_${ group.id }` }
                           className={ clsx(tableStyle.checkbox_label) }>{ group.title }</label>
                </label>
            )
            : (
                <label htmlFor={ `disclosed_${ group.id }` } className={ clsx(tableStyle.column_fixed_height) }>
                    <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled />
                    <label htmlFor={ `disclosed_${ group.id }` }>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </label>
                    <input type="checkbox" name="disclosed" id={ `disclosed_${ group.id }` } hidden
                           onChange={ handleTaskOpening } />
                    <label className={ clsx(style.chevron_icon_label) } htmlFor={ `disclosed_${ group.id }` }>
                        <img src="/img/static/black-arrow-drop.png" alt="" className={ clsx(style.chevron_icon) } />
                    </label>
                    <label htmlFor={ `disclosed_${ group.id }` }
                           className={ clsx(tableStyle.checkbox_label) }>{ getTextExcerpt(group.title, 38) }</label>
                </label>
            )

        return (
            <>
                {/* GROUP */}
                <tr key={ group.id }>
                    <td>{ groupFirstRow }</td>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td>
                        <div className={ clsx(style.table_buttons) }>
                            <ColorfulButton text={ '?????????????? ????????????' }
                                onClick={ () => open('CreatePlanEventModal', {
                                    btnText: '??????????????',
                                    modalData: {
                                        modalTitle: '?????????????? ??????????',
                                        groupId: group.id,
                                        companyId
                                    }
                                }) }
                            />
                            <Tooltip title="????????????????" placement="top">
                                <button onClick={() => open('CreatePlanGroupModal', {
                                    modalData: {
                                        modalTitle: '???????????????? ????????????',
                                        editMode: true,
                                        itemId: group.id,
                                        itemTitle: group.title,
                                        companyId: companyId
                                    },
                                    btnText: '????????????????'
                                })}>
                                    <img src={ EditIcon } alt="????????????????" />
                                </button>
                            </Tooltip>
                            <Tooltip title="??????????????" placement="top">
                                <button onClick={ () => open('ConfirmActionModal', {
                                    btnText: '??????????????',
                                    modalData: { text: `???? ?????????????? ?????? ???????????? ?????????????? ???????????? "${group.title}" ?? ?????? ???? ?????????????` },
                                    onConfirm: () => handleGroupDeleting(group.id)
                                }) }>
                                    <img src={ DeleteIcon } alt="??????????????" />
                                </button>
                            </Tooltip>
                        </div>
                    </td>
                </tr>
                {/* MAIN TASKS */}
                {
                    group.tasks
                        .filter(task => !task.parentId && search ? task.title.match(search) : !task.parentId)
                        .map(task => (
                        <>
                            <tr key={ task.id + task.title } className={ clsx(style.task_row) }
                                style={ { display: openTasks[`disclosed_${group.id}`]?.display ? 'table-row' : 'none' } }
                                onDoubleClick={ () => open('ViewTaskModal', { modalData: { task } }) }>
                                <td>
                                    <label htmlFor={ `disclosed_${ group.id }_${task.id}` }
                                           className={ clsx(tableStyle.column_fixed_height) }>
                                        {
                                            group.tasks.find(subtask => subtask.parentId === task.id) ?
                                                <>
                                                    <input type="checkbox" name="disclosed" id={ `disclosed_${ group.id }_${ task.id }` } hidden
                                                           onChange={ e => handleSubtaskOpening(e, `disclosed_${group.id}`) } />
                                                    <label className={ clsx(style.chevron_icon_label) }
                                                           htmlFor={ `disclosed_${ group.id }_${task.id}` }>
                                                        <img src="/img/static/black-arrow-drop.png" alt=""
                                                             className={ clsx(style.chevron_icon) } />
                                                    </label>
                                                </> : null
                                        }
                                        <label htmlFor={ `disclosed_${ group.id }_${task.id}` } className={ clsx(tableStyle.checkbox_label) }>
                                            { getTextExcerpt(task.title, 30) }
                                        </label>
                                    </label>
                                </td>
                                <td>{ moment(task.startDate).format('DD.MM.YYYY') }</td>
                                <td>{ moment(task.deadline).format('DD.MM.YYYY') }</td>
                                <td>{ getTextExcerpt(task.desc, 20) }</td>
                                <td>
                                    <label htmlFor={ `completed_${task.id}` }
                                           className={ clsx(tableStyle.column_fixed_height, style.status_checkbox_item) }>
                                        <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden
                                               name={ 'completed' } id={ `completed_${task.id}` } checked={ !!task.status }
                                               onChange={e => {
                                                   e.target.checked = !e.target.checked

                                                   open('ConfirmActionModal', {
                                                       modalData: {
                                                           text: `???????????????? ???????????? "${ task.title }" ?????? ${ !task.status ? '??????????????????????' : '???? ??????????????????????' }?`
                                                       },
                                                       btnText: '????',
                                                       onConfirm: () => {
                                                           try {
                                                               handleCompleteChange(e, task.id)
                                                               task.status = e.target.checked ? 0 : 1
                                                           } catch (err) {}
                                                       }
                                                   })
                                               } } />
                                        <label htmlFor={ `completed_${task.id}` }>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M5 13l4 4L19 7" />
                                            </svg>
                                        </label>
                                        <label htmlFor={ `completed_${task.id}` } className={ clsx(tableStyle.checkbox_label, {
                                            [style.green_txt]: !!task.status
                                        }) }>
                                            { task.status ? '??????????????????' : '???? ??????????????????' }
                                        </label>
                                    </label>
                                </td>
                                <td>
                                    <div className={ clsx(style.table_buttons) }>
                                        <ColorfulButton text={ '?????????????? ????????????' }
                                                        onClick={ () => open('CreatePlanEventModal', {
                                                            btnText: '??????????????',
                                                            modalData: {
                                                                modalTitle: '?????????????? ??????????',
                                                                groupId: group.id,
                                                                parentId: task.id,
                                                                companyId
                                                            }
                                                        }) } />
                                        <Tooltip title="?????????????????? ?? ??????????????????" placement="top">
                                            <button onClick={ () => open('ConfirmActionModal', {
                                                btnText: '??????????????????',
                                                modalData: {
                                                    text: task.savedToCalendar ?
                                                        `???????????? ?????? ???????????????????? ?? ??????????????????. ?????????????????? ???????????? "${ task.title }" ?? ?????????????????? ?????????????????`
                                                        : `?????????????????? ???????????? "${ task.title }" ?? ???????????????????`
                                                },
                                                onConfirm: () => handleSavingTaskToCalendar(task)
                                            }) }>
                                                <img src={ CalendarIcon } alt="?? ??????????????????" />
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="????????????????" placement="top">
                                            <button onClick={ () => open('CreatePlanEventModal', {
                                                btnText: '????????????????',
                                                modalData: {
                                                    modalTitle: '???????????????? ????????????',
                                                    editMode: true,
                                                    event: task,
                                                    companyId
                                                }
                                            }) }>
                                                <img src={ EditIcon } alt="????????????????" />
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="??????????????" placement="top">
                                            <button onClick={ () => open('ConfirmActionModal', {
                                                modalData: { text: `???? ?????????????? ?????? ???????????? ?????????????? ???????????? "${task.title}"?` },
                                                btnText: '??????????????',
                                                onConfirm: () => handleTaskDeleting(task.id, group.id)
                                            }) }>
                                                <img src={ DeleteIcon } alt="??????????????" />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                            {/* SUBTASKS */}
                            {
                                group.tasks.filter(subtask => subtask.parentId === task.id && search ? subtask.title.match(search) : subtask.parentId === task.id)
                                    .map(subtask => (
                                    <tr key={ subtask.id + subtask.title } className={ clsx(style.subtask_row) }
                                        style={ {
                                            display: openTasks[`disclosed_${ group.id }`]?.subtasks[`disclosed_${ group.id }_${ subtask.parentId }`]
                                                ? 'table-row' : 'none'
                                        } }>
                                        <td>
                                            <label className={ clsx(tableStyle.column_fixed_height) }>
                                                <label className={ clsx(tableStyle.checkbox_label) }>
                                                    { getTextExcerpt(subtask.title, 27) }
                                                </label>
                                            </label>
                                        </td>
                                        <td>{ moment(subtask.startDate).format('DD.MM.YYYY') }</td>
                                        <td>{ moment(subtask.deadline).format('DD.MM.YYYY') }</td>
                                        <td>{ getTextExcerpt(subtask.desc, 20) }</td>
                                        <td>
                                            <label htmlFor={ `completed_${subtask.id}` }
                                                   className={ clsx(tableStyle.column_fixed_height, style.status_checkbox_item) }>
                                                <input type="checkbox" className={ clsx(tableStyle.checkbox_item) }
                                                       hidden checked={ !!subtask.status }
                                                       name={ 'completed' } id={ `completed_${subtask.id}` }
                                                       onChange={e => {
                                                           e.target.checked = !e.target.checked
                                                           open('ConfirmActionModal', {
                                                               modalData: {
                                                                   text: `???????????????? ???????????? "${ subtask.title }" ?????? ${ !subtask.status ? '??????????????????????' : '???? ??????????????????????' }?`
                                                               },
                                                               btnText: '????',
                                                               onConfirm: () => {
                                                                   try {
                                                                       handleCompleteChange(e, subtask.id)
                                                                       subtask.status = e.target.checked ? 0 : 1
                                                                   } catch (err) {}
                                                               }
                                                           })
                                                       } } />
                                                <label htmlFor={ `completed_${subtask.id}` }>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                              d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </label>
                                                <label htmlFor={ `completed_${subtask.id}` } className={ clsx(tableStyle.checkbox_label, {
                                                    [style.green_txt]: !!subtask.status
                                                }) }>
                                                    { subtask.status ? '??????????????????' : '???? ??????????????????' }
                                                </label>
                                            </label>
                                        </td>
                                        <td>
                                            <div className={ clsx(style.table_buttons) }>
                                                <Tooltip title="?????????????????? ?? ??????????????????" placement="top">
                                                    <button onClick={ () => open('ConfirmActionModal', {
                                                        btnText: '??????????????????',
                                                        modalData: {
                                                            text: subtask.savedToCalendar ?
                                                                `???????????? ?????? ???????????????????? ?? ??????????????????. ?????????????????? ???????????? "${ subtask.title }" ?? ?????????????????? ?????????????????`
                                                                : `?????????????????? ???????????? "${ subtask.title }" ?? ???????????????????`
                                                        },
                                                        onConfirm: () => handleSavingTaskToCalendar(subtask)
                                                    }) }>
                                                        <img src={ CalendarIcon } alt="?? ??????????????????" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip title="????????????????" placement="top">
                                                    <button onClick={ () => open('CreatePlanEventModal', {
                                                        btnText: '????????????????',
                                                        modalData: {
                                                            modalTitle: '???????????????? ????????????',
                                                            editMode: true,
                                                            event: subtask,
                                                            companyId
                                                        }
                                                    }) }>
                                                        <img src={ EditIcon } alt="????????????????" />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip title="??????????????" placement="top">
                                                    <button onClick={ () => open('ConfirmActionModal', {
                                                        modalData: { text: `???? ?????????????? ?????? ???????????? ?????????????? ???????????? "${subtask.title}"?` },
                                                        btnText: '??????????????',
                                                        onConfirm: () => handleTaskDeleting(subtask.id, group.id)
                                                    }) }>
                                                        <img src={ DeleteIcon } alt="??????????????" />
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </>
                    ))
                }
            </>
        )
    }), [rows, openTasks, search])

    return (
        <div className={ clsx(tableStyle.base_table_container) }>
            <>
                <table className={ clsx(tableStyle.base_table, style.specialist_plan_table) }>
                    <thead>
                    <tr>
                        <td>
                            <label>
                                <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled />
                                <label>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5 13l4 4L19 7" />
                                    </svg>
                                </label>
                                <label className={ clsx(tableStyle.checkbox_label) }>???????????????? ????????????</label>
                            </label>
                        </td>
                        <td>???????? ????????????????</td>
                        <td>?????????????? ????????</td>
                        <td>????????????????????</td>
                        <td>????????????</td>
                        <td />
                    </tr>
                    </thead>
                    <tbody>
                    { tableBody() }
                    </tbody>
                </table>
            </>
        </div>
    )
}

export default SpecialistListTable