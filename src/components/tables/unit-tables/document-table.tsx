import React from 'react'
import clsx from 'clsx'
// COMPONENTS
import { ErrorIndicator, Loader } from '@ui/indicators'
import { useModal } from '@modals/index'
// TYPES
import { DocumentTablePropsT } from '@interfaces/company/units'
// STYLES
import tableStyle from '@scss/components/tables/base-table.module.scss'
import style from '@scss/pages/company/units.module.scss'

const DocumentTable: React.FC<DocumentTablePropsT> = ({ items, error, unitId }) => {
    const { open } = useModal()

    const tableBodyContent = items?.map(document => {
        const firstRow = (
            <label htmlFor={ `key` } className={ clsx(tableStyle.column_fixed_height) }>
                <label htmlFor={ `key` } className={ clsx(tableStyle.checkbox_label) }>{ document.title }</label>
            </label>
        )

        return (
            <tr key={ document.id }>
                <td>{ firstRow }</td>
                <td>
                    <button className={ clsx(style.signatures_list_btn) }
                            onClick={ () => open('SignatureLogModal', {
                                modalData: {
                                    document,
                                    unitId
                                }
                            }) }>
                        Журнал подписей
                    </button>
                </td>
            </tr>
        )
    })

    return (
        <div className={ clsx(tableStyle.base_table_container, style.units_table) }>
            {
                error ? <ErrorIndicator /> : !items ? <Loader /> : <table className={ clsx(tableStyle.base_table) }>
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
            }
        </div>
    )
}

export default DocumentTable