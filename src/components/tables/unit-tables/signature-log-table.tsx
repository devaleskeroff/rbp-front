import React from 'react'
import clsx from 'clsx'
// COMPONENTS
import moment from 'moment'
// TYPES
import { DocumentSignatureHistoryTablePropsT } from '@interfaces/company/units'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'

const SignatureLogTable: React.FC<DocumentSignatureHistoryTablePropsT> = ({ signatures }) => {
    const tableBodyContent = signatures.map((signature, idx) => (
        <tr>
            <td>
                <label key={idx} htmlFor={`key`} className={ clsx(tableStyle.column_fixed_height) }>
                    <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden disabled name="" id={`key`} />
                    <label htmlFor={`key`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </label>
                    <label htmlFor={`key`} className={ clsx(tableStyle.checkbox_label) }>{ signature.signer.name }</label>
                </label>
            </td>
            <td>{ signature.position.title }</td>
            <td>{ signature.signedAt ? moment(signature.signedAt).format('DD.MM.YYYY') : 'Ожидает подписи' }</td>
            <td>{ signature.signatureEnd ? moment(signature.signatureEnd).format('DD.MM.YYYY') : '' }</td>
        </tr>
    ))

    return (
        <div className={ clsx(tableStyle.base_table_container) }>
            <table className={ clsx(tableStyle.base_table) }>
                <thead>
                <tr>
                    <td>
                        <label>
                            <input type="checkbox" className={ clsx(tableStyle.checkbox_item) } hidden name="" disabled />
                            <label>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M5 13l4 4L19 7"/>
                                </svg>
                            </label>
                            <label className={ clsx(tableStyle.checkbox_label) }>Сотрудник</label>
                        </label>
                    </td>
                    <td>Должность</td>
                    <td>Дата подписи</td>
                    <td>Дата окончания подписи</td>
                </tr>
                </thead>
                <tbody>
                { tableBodyContent }
                </tbody>
            </table>
        </div>
    )
}

export default SignatureLogTable