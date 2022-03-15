import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useStore } from 'effector-react'
import qs from 'qs'
import clsx from 'clsx'
// COMPONENTS
import useModal from '@modals/modal-hook'
import { WorkspaceTable } from '@components/tables'
import { WorkspaceGroups } from '@components/company'
import { ColorfulButton } from '@components/common/common'
// STORE
import { $WpDocumentsStates, fetchWorkspaceCommonData } from '@store/company/workspace-store'
import {$UserAddPermissions, setModule, UserRoleEnum} from '@store/user-store'
// TYPES
import { CompanyTabPropsT } from '@interfaces/company/company'
import { Modules } from '@interfaces/common'
// STYLES
import style from '@scss/pages/company/company-workspace.module.scss'

export const periods = [
    { label: 'Разово', value: 1001 },
    { label: 'Квартал', value: 1002 },
    { label: 'Раз в месяц', value: 1003 },
    { label: 'Пол года', value: 1004 },
    { label: 'Раз в год', value: 1005 }
]

const Workspace: React.FC<CompanyTabPropsT> = ({ setWithHistory }) => {
    const permissions = useStore($UserAddPermissions)
    const { isFetched } = useStore($WpDocumentsStates)
    const [activeGroupId, setActiveGroupId] = useState<number>(0)

    const { open } = useModal()
    const history = useHistory()

    useEffect(() => {
        setModule(Modules.WORKSPACE)

        if (!isFetched) {
            fetchWorkspaceCommonData()
        }
        const Querystring = qs.parse(history.location.search, { ignoreQueryPrefix: true })

        if (Querystring.groupId) {
            return setActiveGroupId(+Querystring.groupId)
        }
    }, [])

    return (
        <div className="tab-content-item">
            {/* TOP PANEL */ }
            <div className={ clsx(style.workspace_top_panel) }>
                {/* WORKSPACE GROUPS */ }
                <WorkspaceGroups activeGroupId={ activeGroupId } setActiveGroupId={ setActiveGroupId } editBtn/>
                {/* CREATION BUTTONS */ }
                {
                    permissions.roleIsIn([UserRoleEnum.Client], true) ? null :
                        <div className={ clsx(style.workspace_buttons) }>
                            <ColorfulButton text="Создать группу"
                                            onClick={ () => open('CreateWorkspaceGroupModal', {
                                                btnText: 'Создать',
                                                modalData: { modalTitle: 'Создать группу' }
                                            }) }/>
                            <ColorfulButton text="Создать папку" plusIcon={ false }
                                            onClick={ () => open('CreateFolderModal', {
                                                btnText: 'Создать',
                                                modalData: { modalTitle: 'Создать папку', groupId: activeGroupId }
                                            }) }/>
                            <ColorfulButton text="Загрузить документы" plusIcon={ false }
                                            onClick={ () => open('UploadWorkspaceDocumentModal') }
                            />
                        </div>
                }
            </div>
            {/* TABLE */ }
            <WorkspaceTable setWithHistory={ setWithHistory }/>
        </div>
    )
}

export default Workspace
