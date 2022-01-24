import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { ColorfulButton } from '@components/common/common'
import useModal from '@modals/modal-hook'
import { ErrorIndicator, Loader } from '@ui/indicators'
import { Tooltip } from '@material-ui/core'
// STORE
import { $Units, $UnitState, fetchUnits, removeUnit } from '@store/company/units-store'
import { $UserRole, UserRoleEnum } from '@store/user-store'
// TYPES
import { UnitsTablePropsT } from '@interfaces/company/units'
// ICONS
import EditIcon from '@assets/images/dark-edit.png'
import DeleteIcon from '@assets/images/delete.png'
import AddDocIcon from '@assets/images/add-document.png'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/company/units.module.scss'

const UnitsTable: React.FC<UnitsTablePropsT> = ({ setWithHistory }) => {
    // STORE
    const { isLoading, error, isFetched } = useStore($UnitState)
    const units = useStore($Units)
    const userRole = useStore($UserRole)

    const { open } = useModal()
    const history = useHistory()

    useEffect(() => {
        if (!isFetched) {
            fetchUnits()
        }
    }, [])

    const tableBodyContent = units.map(unit => (
        <tr key={ unit.id }>
            <td>
                <Link to={ `/company/units/${ unit.id }` } onClick={ () => setWithHistory(true) }>
                    <label htmlFor={ `key` } className={ clsx(tableStyle.column_fixed_height) }>
                        <label htmlFor={ `key` } className={ clsx(tableStyle.checkbox_label) }>{ unit.title }</label>
                    </label>
                </Link>
            </td>
            <td>{ unit.employeesCount }</td>
            <td>
            {
                userRole === UserRoleEnum.Client ? null :
                    <div className={ clsx(style.unit_actions_col) }>
                        <ColorfulButton text={ 'Добавить должность' } onClick={ () => open('CreateUnitModal', {
                            btnText: 'Добавить',
                            modalData: {
                                modalTitle: 'Добавить должность',
                                fieldTitle: 'Название',
                                positionMode: true,
                                unitId: unit.id
                            }
                        }) }/>
                        <Tooltip title="Добавить документы" placement="top">
                            <img src={ AddDocIcon } alt="" onClick={ () => {
                                history.push({
                                    search: 'group_id=0'
                                })
                                open('AddingUnitDocumentModal', {
                                    modalData: { itemId: unit.id, unitMode: true }
                                })
                            } }/>
                        </Tooltip>
                        <Tooltip title="Изменить" placement="top">
                            <img src={ EditIcon } alt="" onClick={ () => open('CreateUnitModal', {
                                btnText: 'Сохранить',
                                modalData: {
                                    modalTitle: 'Изменить подразделение',
                                    fieldTitle: 'Название',
                                    unitId: unit.id,
                                    itemValue: unit.title,
                                    editMode: true
                                }
                            }) }/>
                        </Tooltip>
                        <Tooltip title="Удалить" placement="top">
                            <img src={ DeleteIcon } alt="" onClick={ () => open('ConfirmActionModal', {
                                btnText: 'Удалить',
                                modalData: { text: `Вы уверены, что хотите удалить подразделение "${ unit.title }"?` },
                                onConfirm: () => removeUnit({ id: unit.id })
                            }) }/>
                        </Tooltip>
                </div>
            }
            </td>
        </tr>
    ))

    return (
        <div className={ clsx(tableStyle.base_table_container, style.units_table) }>
            {
                isLoading ? <Loader /> : error ? <ErrorIndicator /> :
                    <table className={ clsx(tableStyle.base_table) }>
                        <thead>
                        <tr>
                            <td>
                                <label>
                                    <label className={ clsx(tableStyle.checkbox_label) }>Название</label>
                                </label>
                            </td>
                            <td>Кол-во сотрудников</td>
                            <td/>
                        </tr>
                        </thead>
                        <tbody>
                        { tableBodyContent }
                        </tbody>
                    </table>
            }
        </div>
    )
}

export default UnitsTable