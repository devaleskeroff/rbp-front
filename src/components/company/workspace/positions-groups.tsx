import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import qs from 'qs'
import clsx from 'clsx'
import style from '@scss/pages/company/company-workspace.module.scss'

export type WorkspacePositionGroupsPropsT = {
    positions: {
        id: number
        title: string
    }[]
    activePositionId: number
    setActivePositionId: (val: number) => void
}

const WorkspacePositionGroups: React.FC<WorkspacePositionGroupsPropsT> = ({ positions, activePositionId, setActivePositionId }) => {
    const { pathname } = useLocation()
    const history = useHistory()

    useEffect(() => {
        history.push({
            pathname,
            search: qs.stringify({ position_id: activePositionId })
        })
    }, [activePositionId])

    useEffect(() => {
        if (positions && positions.length > 0 && activePositionId === 0) {
            setActivePositionId(positions[0].id)
        }
    }, [positions])

    const handleOnGroupClick = (id: number) => {
        setActivePositionId(id)
    }

    const positionGroups = positions?.map(position => {
        return (
            <div key={ position.id } className={ clsx(style.workspace_group_item, { [style.active]: activePositionId === position.id }) }>
                <button className={ clsx(style.workspace_group_edit_btn, style.without_btn) }
                        onClick={ () => handleOnGroupClick(position.id) }>
                    { position.title }
                </button>
            </div>
        )
    })

    return (
        <div className={ clsx(style.workspace_groups) }>
            { positionGroups }
        </div>
    )
}

export default WorkspacePositionGroups