import React from 'react'
// HOOKS
import useModal from '@modals/modal-hook'
import useStyles from '@ui/material-ui-styles'
// COMPONENTS
import { TextField } from '@material-ui/core'
import { respondToFeedback } from '@store/feedback-store'
// SERVICES
// STORE

const RespondToFeedbackModal = () => {
    const { modalComponent, modalData, close } = useModal()
    const classes = useStyles()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const answer = document.querySelector('textarea[name="answer"]') as HTMLInputElement
        const modalBtn = document.querySelector('button.modal_btn') as HTMLButtonElement
        modalBtn.disabled = true

        if (!answer?.value) {
            return
        }
        const feedbackId = modalData.feedbackId

        respondToFeedback({
            id: feedbackId,
            answer: answer.value,
            cb: close
        })
    }

    return (
        <div key={ modalComponent.key }>
            <p className="modal_title">Ответить на вопрос</p>
            <div className="underline" />
            <form className={ `modal_content ${ classes.root }` } onSubmit={ handleSubmit }>
                <TextField
                    label={'Ответ'}
                    name={'answer'}
                    required
                    multiline
                    rows={ 5 }
                    variant="filled"
                />
                <button type="submit" className="modal_btn">Ответить</button>
            </form>
        </div>
    )
}

export default RespondToFeedbackModal