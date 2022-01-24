import clsx from 'clsx'
// COMPONENTS
import useModal from '@modals/modal-hook'
// STYLES
import style from '@scss/modals/common/confirm-action.module.scss'

const ConfirmActionModal = () => {
    const { close, modalComponent, modalData } = useModal()

    return (
        <div key={modalComponent.key} className={ clsx(style.confirm_modal) }>
            <p className="modal_title">Подтвердите действие</p>
            <div className="underline" />
            <div className="modal_content">
                <svg className={ clsx(style.exclamation_icon) } fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className={ clsx(style.confirm_modal_text) }>{ modalData.text }</p>
                <div className='modal_buttons_group'>
                    <button type='submit' className='modal_btn' onClick={e => {
                        (e.target as HTMLButtonElement).disabled = true
                        close()
                        return modalComponent.onConfirm ? modalComponent.onConfirm() : null
                    }}>
                        { modalComponent.btnText }
                    </button>
                    <button type='submit' className='modal_btn colorful-btn' onClick={close}>Отменить</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmActionModal