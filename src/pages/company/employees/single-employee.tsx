import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import Loader from '@ui/indicators/loader'
import useModal from '@modals/modal-hook'
import { EmployeeSignaturesTable } from '@components/tables'
import { ErrorIndicator } from '@ui/indicators'
// STORE
import { $Employees, $EmployeesStates, fetchEmployees, setEmployees } from '@store/company/employees-store'
import { $Units, setUnits } from '@store/company/units-store'
import { pushToArchiveEmployees } from '@store/company/archive-store'
import { $UserAddPermissions, UserRoleEnum } from '@store/user-store'
// SERVICE
import EmployeeService from '@services/employee-service'
// TYPES
import { CompanyTabPropsT } from '@interfaces/company/company'
import { EmployeeDocumentT, EmployeeListDataT, RelatedEmployeeDataT } from '@interfaces/company/employees'
// ICONS
import EditIcon from '@assets/images/dark-edit.png'
import ArchiveIcon from '@assets/images/archive.png'
// STYLES
import style from '@scss/pages/company/single-employee.module.scss'

const SingleEmployee: React.FC<CompanyTabPropsT> = ({ setWithHistory }) => {
    // STORES
    const employees = useStore($Employees)
    const { isFetched } = useStore($EmployeesStates)
    const units = useStore($Units)
    const permissions = useStore($UserAddPermissions)
    // STATES
    const [currentEmployee, setCurrentEmployee] = useState<RelatedEmployeeDataT | null>(null)
    const [state, setState] = useState({
        isInEmployeesList: false,
        error: false
    })
    const { open } = useModal()
    const query = useRouteMatch<{ id: string }>()
    const history = useHistory()

    useEffect(() => {
        if (!isFetched) {
            fetchEmployees()
        }
        setWithHistory(true)
    }, [])

    useEffect(() => {
        if (isFetched) {
            const currentEmployeeInCommonList = employees.find(employee => employee.id === +query.params.id)
            const extended = !currentEmployeeInCommonList

            EmployeeService.GetAllEmployeeData(+query.params.id, extended, (err, res) => {
                if (err || !res) {
                    return setState({ ...state, error: true })
                }
                if (!extended) {
                    return setCurrentEmployee({
                        ...currentEmployeeInCommonList as EmployeeListDataT,
                        signed_documents: res.data as EmployeeDocumentT[]
                    })
                }
                setCurrentEmployee(res.data as RelatedEmployeeDataT)
            })

            if (currentEmployeeInCommonList) {
                setState({ ...state, isInEmployeesList: true })
            }
        }
    }, [isFetched])

    const handleSendingNewSignatures = () => {
        EmployeeService.GetAllEmployeeData(+query.params.id, false, (err, res) => {
            if (err || !res) {
                return setState({ ...state, error: true })
            }
            setCurrentEmployee({
                ...currentEmployee as EmployeeListDataT,
                signed_documents: res.data as EmployeeDocumentT[]
            })
        })
    }

    const handleAddToArchive = (employee: RelatedEmployeeDataT) => {
        EmployeeService.AddToArchive(employee.id, (err) => {
            if (err) {
                return console.log('При добавлении пользователя в архив произошла ошибка')
            }
            const employeeUnitsIds = employee.units.map(unit => unit.id)

            setUnits(units.map(unit => {
                if (employeeUnitsIds.find(employeeUnitId => employeeUnitId === unit.id)) {
                    unit.employeesCount--
                }
                return unit
            }))
            pushToArchiveEmployees(employee)
            setEmployees(employees.filter(empl => empl.id !== employee.id))
            history.push('/company/employees')
        })
    }

    return (
        <>
            <div className={ clsx(style.single_employee__info_container) }>
                {/* FIRST BLOCK */ }
                {
                    state.error ? <ErrorIndicator /> : !currentEmployee ? <Loader /> :
                        <section className={ clsx(style.single_employee__section) }>
                            <div className={ clsx(style.single_employee__section_top_panel) }>
                                <p className={ clsx(style.employee_name) }>
                                    { currentEmployee.name }
                                </p>
                                {
                                    permissions.roleIsIn([UserRoleEnum.Client], true) ? null :
                                        <div className={ clsx(style.single_employee__buttons) }>
                                            <button className={ clsx(style.single_employee__button) }
                                                    onClick={ () => open('CreateEmployeeModal', {
                                                        btnText: 'Сохранить',
                                                        modalData: { editMode: true, employee: currentEmployee },
                                                        onConfirm: (data: EmployeeListDataT) => setCurrentEmployee({
                                                            ...currentEmployee,
                                                            ...data
                                                        })
                                                    }) }>
                                                <img src={ EditIcon } alt=""/>
                                            </button>
                                            <button className={ clsx(style.single_employee__button) }
                                                    onClick={ () => handleAddToArchive(currentEmployee) }>
                                                <img src={ ArchiveIcon } alt=""/>
                                            </button>
                                        </div>
                                }
                            </div>
                            {
                                permissions.roleIsIn([UserRoleEnum.Client], true) ? null :
                                    <button className={ clsx(style.send_to_signature_btn) }
                                            onClick={ () => open('SendingForSignatureModal', {
                                                modalData: {
                                                    employeeId: currentEmployee.id,
                                                    positions: currentEmployee?.positions || null
                                                },
                                                onConfirm: handleSendingNewSignatures
                                            }) }>
                                        Отправить на подпись
                                    </button>
                            }
                            <p className={ clsx(style.key_value_item, { ['mt-12']: permissions.roleIsIn([UserRoleEnum.Client], true) }) }>
                                Подразделение:
                                <span>{ currentEmployee.units.map(unit => unit.title).join(', ') }</span>
                            </p>
                            <p className={ clsx(style.key_value_item) }>Должность:
                                <span>{ currentEmployee.positions.map(pos => pos.title).join(', ') }</span>
                            </p>
                            <p className={ clsx(style.key_value_item) }>Почта: <span>{ currentEmployee.email }</span></p>
                            <p className={ clsx(style.key_value_item) }>Телефон: <span>{ currentEmployee.phone }</span></p>
                        </section>
                }
            </div>
            {/* SIGNATURES TABLE */}
            <EmployeeSignaturesTable items={currentEmployee?.signed_documents} employeeId={currentEmployee?.id as number} />
        </>
    )
}

export default SingleEmployee
