import React from 'react'
import clsx from 'clsx'
// COMPONENTS
import useModal from '@modals/modal-hook'
// STYLES
import style from '@scss/modals/company/document-view.module.scss'

const DocumentViewModal = () => {
    const { modalComponent, modalData } = useModal()

    return (
        <div key={modalComponent.key} className={ clsx(style.document_view_modal) }>
            <p className="modal_title">Просмотр документа</p>
            <div className="underline" />
            <div className={`modal_content ${clsx(style.document_view_modal_content)}`}>
                <iframe src={`https://docs.google.com/gview?url=${process.env.API_URL}${modalData.src}&embedded=true`}
                        frameBorder="0" className={clsx(style.document_view_iframe)}>
                </iframe>
            </div>
        </div>
    )
}

export default DocumentViewModal