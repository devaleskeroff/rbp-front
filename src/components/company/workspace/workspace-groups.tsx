import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
import qs from 'qs'
// HOOKS
import useModal from '@modals/modal-hook'
// STORE
import { $WpGroups } from '@store/company/workspace-store'
import { $UserRole, UserRoleEnum } from '@store/user-store'
// STYLES
import style from '@scss/pages/company/company-workspace.module.scss'

type WorkspaceGroupsPropsT = {
    activeGroupId: number
    setActiveGroupId: (id: number) => void
    editBtn?: boolean
}

const WorkspaceGroups: React.FC<WorkspaceGroupsPropsT> = ({ activeGroupId, setActiveGroupId, editBtn = false }) => {
    const wpGroups = useStore($WpGroups)
    const userRole = useStore($UserRole)

    const { open } = useModal()
    const { pathname } = useLocation()
    const history = useHistory()

    useEffect(() => {
        history.push({
            pathname,
            search: qs.stringify({ group_id: activeGroupId })
        })
    }, [activeGroupId])

    const handleOnGroupClick = (id: number) => {
        setActiveGroupId(id)
    }

    const groups = wpGroups.map(item => {
        return (
            <div key={ item.id } className={ clsx(style.workspace_group_item, { [style.active]: activeGroupId === item.id }) }>
                <button className={ clsx(style.workspace_group_edit_btn, { [style.without_btn]: !editBtn }) }
                        onClick={ () => handleOnGroupClick(item.id) }>
                    { item.title }
                </button>
                {
                    userRole !== UserRoleEnum.Client && editBtn ?
                        <svg className={ clsx(style.workspace_group_edit_icon) }
                             onClick={ () => open('CreateWorkspaceGroupModal', {
                                 btnText: 'Сохранить',
                                 modalData: {
                                     modalTitle: 'Изменить группу',
                                     groupId: item.id,
                                     itemTitle: item.title,
                                     editMode: true
                                 }
                             }) }
                             viewBox="0 0 16 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M3.59434 3.96227C3.36665 3.96227 3.14829 4.05272 2.98729 4.21372C2.8263 4.37471 2.73585 4.59307 2.73585 4.82076V13.4057C2.73585 13.6333 2.8263 13.8517 2.98729 14.0127C3.14829 14.1737 3.36665 14.2642 3.59434 14.2642H12.1792C12.4069 14.2642 12.6253 14.1737 12.7863 14.0127C12.9473 13.8517 13.0377 13.6333 13.0377 13.4057V10.1311C13.0377 9.92794 13.2025 9.76321 13.4057 9.76321C13.6089 9.76321 13.7736 9.92794 13.7736 10.1311V13.4057C13.7736 13.8285 13.6056 14.234 13.3066 14.533C13.0076 14.832 12.6021 15 12.1792 15H3.59434C3.17149 15 2.76597 14.832 2.46697 14.533C2.16797 14.234 2 13.8285 2 13.4057V4.82076C2 4.39791 2.16797 3.99239 2.46697 3.69339C2.76597 3.3944 3.17149 3.22642 3.59434 3.22642H6.86887C7.07207 3.22642 7.23679 3.39115 7.23679 3.59435C7.23679 3.79754 7.07207 3.96227 6.86887 3.96227H3.59434Z"
                                  fill="currentColor" />
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M11.9191 2.10776C12.0628 1.96408 12.2957 1.96408 12.4394 2.10776L14.8922 4.56059C14.9612 4.62959 15 4.72317 15 4.82075C15 4.91833 14.9612 5.01192 14.8922 5.08092L8.76016 11.213C8.69116 11.282 8.59758 11.3208 8.5 11.3208H6.04717C5.84397 11.3208 5.67924 11.156 5.67924 10.9528V8.5C5.67924 8.40242 5.71801 8.30884 5.78701 8.23984L11.9191 2.10776ZM6.41509 8.6524V10.5849H8.3476L14.1118 4.82075L12.1792 2.88825L6.41509 8.6524Z"
                                  fill="currentColor" />
                        </svg>
                        : null
                }
            </div>
        )
    })

    groups.unshift((
        <div key={ 0 } className={ clsx(style.workspace_group_item, { [style.active]: activeGroupId === 0 }) }>
            <button className={ clsx(style.workspace_group_edit_btn) } onClick={ () => setActiveGroupId(0) }>
                Общее
            </button>
        </div>
    ))

    return (
        <div className={ clsx(style.workspace_groups) }>
            { groups }
        </div>
    )
}

export default WorkspaceGroups