import React from 'react'
import {useStore} from 'effector-react'
import clsx from 'clsx'
//COMPONENTS
import moment from 'moment'
import {Loader} from '@ui/indicators'
// SERVICE
import EmployeeService from '@services/employee-service'
// STORE
import {$Company} from '@store/company/company-store'
import {$UserAddPermissions, UserRoleEnum} from '@store/user-store'
// TYPES
import {EmployeeSignaturesTablePropsT} from '@interfaces/company/employees'
import {CompanyT} from '@interfaces/company/company'
// ICONS
import DownloadIcon from '@assets/images/download.png'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/company/single-employee.module.scss'

const EmployeeSignaturesTable: React.FC<EmployeeSignaturesTablePropsT> = ({ items, employeeId }) => {
    const permissions = useStore($UserAddPermissions)

    const resendForSignature = (e: any, signatureId: number) => {
        EmployeeService.ReSendForSignature(employeeId, signatureId, (err, res) => {
            if (err) {
                return console.log('При отправке документа на подпись произошла ошибка')
            }
            e.target.style.display = 'none'
        })
    }

    const tableBodyContent = items?.map(document => (
        <tr key={document.id}>
            <td>
                <label key={document.id} htmlFor={`key`} className={ clsx(tableStyle.column_fixed_height) }>
                    <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name="" id={`key`} />
                    <label htmlFor={`key`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </label>
                    <label htmlFor={`key`} className={ clsx(tableStyle.checkbox_label) }>{ document.file.title }</label>
                </label>
            </td>
            <td>{ document.position.title }</td>
            <td>{ document.signedAt ? moment(document.signedAt).format('DD.MM.YYYY') : 'Ожидает подписи' }</td>
            <td>{ document.signatureEnd ? moment(document.signatureEnd).format('DD.MM.YYYY') : '' }</td>
            <td>
                {
                    permissions.roleIsNotIn([UserRoleEnum.Client], true) && document.status !== 1 ?
                        <button className={ clsx(style.send_to_signature_btn) } onClick={e => resendForSignature(e, document.id)}>
                            Отправить на подпись
                        </button>
                        : null
                }
                <div className={ clsx(style.action_icons) }>
                    <a href={ `${process.env.API_URL}/api/v1/file/${ document.file.id }?type=workspace&hash=${ document.file.hash }` }
                       target={ '_blank' } rel={ 'noreferrer' } download>
                        <img src={ DownloadIcon } alt="Скачать" />
                    </a>
                </div>
            </td>
        </tr>
    ))

    return (
        <div className={ clsx(tableStyle.base_table_container) }>
            {
                !items ? <Loader /> :
                    <table className={ clsx(tableStyle.base_table, style.employee_signatures_table) }>
                        <thead>
                        <tr>
                            <td>
                                <label>
                                    <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden name="" disabled />
                                    <label>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M5 13l4 4L19 7" />
                                        </svg>
                                    </label>
                                    <label className={ clsx(tableStyle.checkbox_label) }>Название документа</label>
                                </label>
                            </td>
                            <td>Должность</td>
                            <td>Дата подписи</td>
                            <td>Дата окончания подписи</td>
                            <td />
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

export default EmployeeSignaturesTable
