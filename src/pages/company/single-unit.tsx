import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import useModal from '@modals/modal-hook'
import PositionTable from '@components/tables/unit-tables/position-table'
import { ColorfulButton } from '@components/common/common'
import DocumentTable from '@components/tables/unit-tables/document-table'
import { Loader } from '@ui/indicators'
import { EmployeesTable } from '@components/tables'
// STORE
import { $Units, $UnitState, fetchUnits } from '@store/company/units-store'
import { $UserAddPermissions, UserRoleEnum } from '@store/user-store'
// SERVICE
import UnitService from '@services/unit-service'
// TYPES
import { UnitFileDataT, UnitShortDataT } from '@interfaces/company/units'
import { EmployeeListDataT } from '@interfaces/company/employees'
// STYLES
import style from '@scss/pages/company/single-unit.module.scss'

enum UnitInfoTypeEnum {
    positions = 1,
    employees,
    documents
}

const SingleUnit: React.FC = () => {
    // STORES
    const units = useStore($Units)
    const { isFetched } = useStore($UnitState)
    const permissions = useStore($UserAddPermissions)
    // STATES
    const [currentUnit, setCurrentUnit] = useState<UnitShortDataT | undefined>(undefined)
    const [currentUnitEmployees, setCurrentUnitEmployees] = useState<EmployeeListDataT[] | null>(null)
    const [currentUnitFiles, setCurrentUnitFiles] = useState<UnitFileDataT[] | null>(null)
    const [addDataStates, setAddDataStates] = useState({
        employeesFetched: false,
        documentsFetched: false,
        employeesError: false,
        documentsError: false,
    })
    const [type, setType] = useState<1 | 2 | 3>(1)

    const { open } = useModal()
    const query = useRouteMatch<{ id: string }>()
    const history = useHistory()

    useEffect(() => {
        if (!isFetched) {
            fetchUnits()
        }
    }, [])

    useEffect(() => {
        if (isFetched) {
            const currentUnit = units.find(unit => unit.id === +query.params.id)
            setCurrentUnit(currentUnit)
        }
    }, [isFetched])

    useEffect(() => {
        if (type === 2 && !addDataStates.employeesFetched && currentUnit) {
            UnitService.GetUnitEmployees(currentUnit.id, (err, res) => {
                if (err || !res) {
                    setAddDataStates({ ...addDataStates, employeesError: true })
                    return console.log('?????? ?????????????????? ???????????? ?????????????????????? ?????????????????? ????????????')
                }
                setAddDataStates({ ...addDataStates, employeesFetched: true })
                setCurrentUnitEmployees(res.data)
            })
        } else if (type === 3 && !addDataStates.documentsFetched && currentUnit) {
            UnitService.GetUnitFiles(currentUnit.id, (err, res) => {
                if (err || !res) {
                    setAddDataStates({ ...addDataStates, documentsError: true })
                    return console.log('?????? ?????????????????? ???????????? ?????????????????? ????????????')
                }
                setAddDataStates({ ...addDataStates, documentsFetched: true })
                setCurrentUnitFiles(res.data)
            })
        }
    }, [type, currentUnit])

    const handleAddingNewEmployee = (newEmployee: EmployeeListDataT) => {
        const employeeAddedToCurrentUnit = newEmployee.units.find(unit => unit.id === currentUnit?.id)
        if (employeeAddedToCurrentUnit) {
            setCurrentUnitEmployees([...currentUnitEmployees as EmployeeListDataT[], newEmployee])
        }
    }

    return (
        <div className="tab-content-item">
            <div className={ clsx(style.unit_top_panel) }>
                <p className={ clsx(style.unit_title) }>{ currentUnit?.title }</p>
                <button onClick={ () => setType(1) } className={ clsx(style.unit_type_btn, {
                    [style.active]: type === UnitInfoTypeEnum.positions
                }) }>
                    ??????????????????
                </button>
                <button onClick={ () => setType(2) } className={ clsx(style.unit_type_btn, {
                    [style.active]: type === UnitInfoTypeEnum.employees
                }) }>
                    ????????????????????
                </button>
                <button onClick={ () => setType(3) } className={ clsx(style.unit_type_btn, {
                    [style.active]: type === UnitInfoTypeEnum.documents
                }) }>
                    ??????????????????
                </button>
            </div>
            {
                !currentUnit ? <Loader /> :
                    type === UnitInfoTypeEnum.positions ?
                        <>
                            {
                                permissions.roleIsIn([UserRoleEnum.Client], true) ? null :
                                    <div className={ clsx(style.creation_btn) }>
                                        <ColorfulButton text={ '???????????????? ??????????????????' } onClick={ () => open('CreateUnitModal', {
                                            btnText: '????????????????',
                                            modalData: {
                                                modalTitle: '???????????????? ??????????????????',
                                                fieldTitle: '????????????????',
                                                positionMode: true,
                                                unitId: currentUnit.id
                                            }
                                        }) } />
                                    </div>
                            }
                            <PositionTable items={ currentUnit.positions } unitId={currentUnit.id} />
                        </>
                        : type === UnitInfoTypeEnum.employees ?
                            <>
                                {
                                    permissions.roleIsIn([UserRoleEnum.Client], true) ? null :
                                        <div className={ clsx(style.creation_btn) }>
                                            <ColorfulButton text={ '???????????????? ????????????????????' }
                                                            onClick={ () => open('CreateEmployeeModal', {
                                                                btnText: '????????????????',
                                                                onConfirm: employee => handleAddingNewEmployee(employee as EmployeeListDataT)
                                                            }) }
                                            />
                                        </div>
                                }
                                {
                                    !currentUnitEmployees ? <Loader /> :
                                        <EmployeesTable items={ currentUnitEmployees }
                                                        setItems={ setCurrentUnitEmployees }
                                                        unitId={currentUnit.id} />
                                }
                            </>
                            : type === UnitInfoTypeEnum.documents ?
                                <>
                                    {
                                        permissions.roleIsIn([UserRoleEnum.Client], true) ? null :
                                            <div className={ clsx(style.creation_btn) }>
                                                <ColorfulButton text={ '???????????????? ??????????????????' }
                                                                onClick={ () => {
                                                                    history.push({
                                                                        search: 'group_id=0'
                                                                    })
                                                                    open('AddingUnitDocumentModal', {
                                                                        modalData: { itemId: currentUnit.id, unitMode: true }
                                                                    })
                                                                } } />
                                            </div>
                                    }
                                    <DocumentTable items={ currentUnitFiles }
                                                   error={ addDataStates.documentsError }
                                                   unitId={ currentUnit.id }
                                    />
                                </>
                                : null
            }
        </div>
    )
}

export default SingleUnit
