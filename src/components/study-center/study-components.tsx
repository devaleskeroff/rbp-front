import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import moment from 'moment'
import { useModal } from '@modals/index'
// STORE
import { $UserRole, UserRoleEnum } from '@store/user-store'
import { removeCourse, setSelectedCourse } from '@store/study-store'
// SERVICE
import CourseService from '@services/course-service'
// UTILS
import { ConcatApiUrl } from '@utils/api-tools'
// ICONS
import EditIcon from '@assets/images/dark-edit.png'
import DeleteIcon from '@assets/images/delete.png'
// TYPES
import { CourseT } from '@interfaces/study-center'
// STYLE
import style from '@scss/pages/study-center.module.scss'

export const CourseItems = ({ items }: { items: CourseT[] }) => {
    const userRole = useStore($UserRole)
    const history = useHistory()
    const { open } = useModal()

    const handleDelete = (id: number) => {
        CourseService.DeleteCourse(id, (err, res) => {
            if (err) {
                return console.log('При удалении записи произошла ошибка')
            }
            removeCourse(id)
            history.push('/study-center')
        })
    }

    const content = items.map((course, idx) => {
        return (
            <div key={ idx } className={ clsx(style.course_item) }>
                {
                    userRole !== UserRoleEnum.SuperAdmin ? null :
                        <>
                            <Link to={`/study-center/${course.id}`} className={ clsx(style.course_edit_btn) }
                                  onClick={() => setSelectedCourse(course)}>
                                <img src={ EditIcon } alt="" />
                            </Link>
                            <button className={ clsx(style.course_delete_btn) } onClick={() => open('ConfirmActionModal', {
                                modalData: { text: `Вы уверены, что хотите удалить запись "${course.title}"?` },
                                btnText: 'Удалить',
                                onConfirm: () => handleDelete(course.id)
                            })}>
                                <img src={ DeleteIcon } alt=""/>
                            </button>
                        </>
                }
                <a target={ '_blank' } href={ course.link } rel="noreferrer">
                    <div className={ `${ clsx(style.img_section) } ${ clsx(style.with_label) }` }>
                        <img src={ ConcatApiUrl(course.image) } alt=""/>
                        <div
                            className={ clsx(style.course_label) }>{ course.type === 'COURSE' ? 'Курс' : 'Вебинар' }</div>
                    </div>
                    <div className={ clsx(style.info_section) }>
                        <div className={ clsx(style.tags) }>
                            {
                                !course.tags ? null : course.tags.split(',').map((tagText, idx) => (
                                    <p key={ idx } className={ clsx(style.tag_item) }>#{ tagText.trim() }</p>
                                ))
                            }
                        </div>
                        <p className={ clsx(style.course_title) }>{ course.title }</p>
                        <p className={ clsx(style.course_date) }>Начало: { moment(course.dateStart).format('lll') }</p>
                        <p className={ clsx(style.teachers) }>
                           { course.teachers ? course.type === 'COURSE' ? 'Преподаватели: ' : 'Спикеры: ' : null }
                           <span>
                               {
                                   !course.teachers ? null :
                                       course.teachers.split(',').map((teacher, idx) => (
                                           idx === 0 ? teacher.trim() : ', ' + teacher.trim()
                                       ))
                               }
                           </span>
                        </p>
                        <p className={ clsx(style.course_desc) }>{ course.desc }</p>
                    </div>
                </a>
            </div>
        )
    })

    return (
        <div className={ clsx(style.course_items) }>
            { content }
        </div>
    )
}