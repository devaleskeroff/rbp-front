import React, { FC, useState } from 'react'
import clsx from 'clsx'
// COMPONENTS
import useModal from '@modals/modal-hook'
import { TextField } from '@material-ui/core'
import useStyles from '@ui/material-ui-styles'
// STYLES
import style from '@scss/modals/company/calendar.module.scss'
import EventService from '@services/event-service'

type EventEmailModalPropsT = {
   onConfirm: (...props: any) => void
   state: number
   setState: (newState: any) => void
}

const EventEmailModal: FC<EventEmailModalPropsT> = ({ onConfirm, state, setState }) => {
   const [error, setError] = useState('')

   const { close, modalComponent, modalData } = useModal()
   const classes = useStyles()

   const sendEmail = (e: any) => {
       e.preventDefault()
       const modalBtn = document.querySelector(`button.${style.send}`) as HTMLButtonElement
       modalBtn.disabled = true

       const email = document.querySelector('input[name="email"]') as HTMLInputElement

       if (!email.value) {
          return
       }
       EventService.SendByEmail(modalData.event.id, email.value, modalData.event.type, (err, res) => {
           if (err) {
              return setError('При отправке письма произошла ошибка')
           }
           close()
       })
   }

   return (
      <div key={modalComponent.key} id={ clsx(style.event_email_modal) }>
         <div className={ clsx(style.content) }>
            {/* FORM */}
            <form className={`${classes.root} ${ clsx(style.modal_form)}`} onSubmit={ sendEmail }>
               <TextField label="Введите email" name={'email'} variant="filled" required type={'email'} />
               <p className="error-text">{ error }</p>
               <button className={ clsx(style.send) }>Отправить</button>
            </form>
         </div>
      </div>
   )
}

export default EventEmailModal