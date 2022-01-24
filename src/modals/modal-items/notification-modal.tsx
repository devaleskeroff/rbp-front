import React from 'react'
import clsx from 'clsx'
// HOOK
import { useModal } from '@modals/index'
// STYLE
import style from '@scss/modals/common/confirm-action.module.scss'

const NotificationModal = () => {
    const { modalComponent, modalData,  close } = useModal()

    return (
        <div key={modalComponent.key} className={ clsx(style.confirm_modal) }>
            <p className="modal_title">{ modalData.modalTitle }</p>
            <div className="underline" />
            <div className="modal_content">
                <svg className={ clsx(style.exclamation_icon) } fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className={ clsx(style.confirm_modal_text) }>{ modalData.text }</p>
                <div className='modal_buttons_group'>
                    <button type='submit' className='modal_btn colorful-btn' onClick={ close } style={{ marginRight: 0 }}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotificationModal