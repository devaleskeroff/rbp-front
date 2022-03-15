import React from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import useModal from '@modals/modal-hook'
import { Tooltip } from '@material-ui/core'
// SERVICE
import UnitService from '@services/unit-service'
// STORE
import { $Units, setUnits } from '@store/company/units-store'
import { $UserAddPermissions, UserRoleEnum } from '@store/user-store'
// TYPES
import { PositionsTablePropsT } from '@interfaces/company/units'
// ICONS
import EditIcon from '@assets/images/dark-edit.png'
import DeleteIcon from '@assets/images/delete.png'
import AddDocIcon from '@assets/images/add-document.png'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/company/units.module.scss'

const PositionTable: React.FC<PositionsTablePropsT> = ({ items, unitId }) => {
    const units = useStore($Units)
    const permissions = useStore($UserAddPermissions)

    const { open } = useModal()

    const handlePositionDelete = (positionId: number) => {
        UnitService.RemoveUnitPosition(positionId, (err, res) => {
            if (err) {
                return console.log('При удалении должности произошла ошибка')
            }
            setUnits(units.map(unit => {
                if (unit.id === unitId) {
                    unit.positions = unit.positions.filter(position => position.id !== positionId)
                }
                return unit
            }))
        })
    }

    const tableBodyContent = items.map(position => {
        const firstRow = (
            <label htmlFor={ `key` } className={ clsx(tableStyle.column_fixed_height) }>
                <label htmlFor={ `key` } className={ clsx(tableStyle.checkbox_label) }>{ position.title }</label>
            </label>
        )

        return (
            <tr key={ position.id }>
                <td>{ firstRow }</td>
                <td>
                    {
                        permissions.roleIsIn([UserRoleEnum.Client], true) ? null :
                            <div className={ clsx(style.unit_actions_col) }>
                                <Tooltip title="Добавить документы" placement="top">
                                    <img src={ AddDocIcon } alt="" onClick={() => open('AddingUnitDocumentModal', {
                                        modalData: { itemId: position.id, unitId, positionMode: true }
                                    })} />
                                </Tooltip>
                                <Tooltip title="Изменить" placement="top">
                                    <img src={ EditIcon } alt="" onClick={ () => open('CreateUnitModal', {
                                        btnText: 'Сохранить',
                                        modalData: {
                                            modalTitle: 'Изменить должность',
                                            fieldTitle: 'Название',
                                            positionMode: true,
                                            editMode: true,
                                            itemValue: position.title,
                                            position: position,
                                            unitId: unitId
                                        }
                                    }) } />
                                </Tooltip>
                                <Tooltip title="Удалить" placement="top">
                                    <img src={ DeleteIcon } alt="" onClick={() => open('ConfirmActionModal', {
                                        btnText: 'Удалить',
                                        modalData: { text: `Вы уверены, что хотите удалить подразделение "${position.title}"?` },
                                        onConfirm: () => handlePositionDelete(position.id)
                                    })} />
                                </Tooltip>
                            </div>
                    }
                </td>
            </tr>
        )
    })

    return (
        <div className={ clsx(tableStyle.base_table_container, style.units_table) }>
            <table className={ clsx(tableStyle.base_table) }>
                <thead>
                <tr>
                    <td>
                        <label>
                            <label className={ clsx(tableStyle.checkbox_label) }>Название</label>
                        </label>
                    </td>
                    <td />
                </tr>
                </thead>
                <tbody>
                { tableBodyContent }
                </tbody>
            </table>
        </div>
    )
}

export default PositionTable
