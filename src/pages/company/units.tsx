import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { UnitsTable } from '@components/tables'
import useModal from '@modals/modal-hook'
import { ColorfulButton } from '@components/common/common'
// STORE
import { $UserAddPermissions, setModule, UserRoleEnum } from '@store/user-store'
// TYPES
import {CompanyTabPropsT} from '@interfaces/company/company'
import { Modules } from '@interfaces/common'
// STYLES
import style from '@scss/pages/company/units.module.scss'

const Units: React.FC<CompanyTabPropsT> = ({ setWithHistory }) => {
    const permissions = useStore($UserAddPermissions)
    const { open } = useModal()

    useEffect(() => {
        setModule(Modules.SUBDIVISION)
    }, [])

    return (
        <div className="tab-content-item">
            <div className={ clsx(style.unit_top_panel) }>
                {
                    permissions.roleIsIn([UserRoleEnum.Client], true) ? null :
                        <ColorfulButton text={ 'Добавить подразделение' } onClick={ () => open('CreateUnitModal', {
                            btnText: 'Добавить',
                            modalData: { modalTitle: 'Добавить подразделение', fieldTitle: 'Название' }
                        }) }/>
                }
            </div>
            <UnitsTable setWithHistory={ setWithHistory }/>
        </div>
    )
}

export default Units
