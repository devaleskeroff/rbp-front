import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import moment from 'moment'
import useModal from '@modals/modal-hook'
import { DocumentViewButton } from '@components/common/common'
// SERVICE
import PrescriptionService from '@services/prescription-service'
// STORE
import { $User } from '@store/user-store'
import {
    $Prescriptions,
    removePrescription,
    setPrescriptions,
    setSelectedPrescription
} from '@store/prescription-store'
// TYPES
import { PrescriptionItemsPropsT, PrescriptionT } from '@interfaces/prescriptions'
import { UserDataT } from '@interfaces/user'
// ICONS
import EditIcon from '@assets/images/dark-edit.png'
import DeleteIcon from '@assets/images/delete.png'
// STYLE
import style from '@scss/pages/prescription/prescriptions.module.scss'

export const PrescriptionItems: React.FC<PrescriptionItemsPropsT> = ({ item, singleMode }) => {
    const user = useStore($User) as UserDataT
    const { count, rows } = useStore($Prescriptions)
    const { open } = useModal()

    const handleComplete = (e: any, prescriptionId: number, creatorId: number) => {
        if (user.id !== creatorId) {
            return e.target.checked = !e.target.checked
        }
        PrescriptionService.MarkAsCompleted(prescriptionId, e.target.checked, (err, res) => {
            if (err) {
                e.target.checked = !e.target.checked
                return console.log('Произошла неожиданная ошибка')
            }
            setPrescriptions({
                count, rows: rows.map(prescription => {
                    if (prescription.id === prescriptionId) {
                        prescription.completed = e.target.checked
                    }
                    return prescription
                })
            })
        })
    }

    const handleDelete = (id: number) => {
        PrescriptionService.DeletePrescription(id, (err, res) => {
            if (err) {
                return console.log('При удалении предписания произошла ошибка')
            }
            removePrescription(id)
        })
    }

    const prescriptions = item || rows
    const WrapContent: React.FC<{ prescription: PrescriptionT }> = ({ prescription, children }) => !item ?
        <Link to={`/prescriptions/${prescription.id}`} onClick={() => setSelectedPrescription(prescription)}>{ children }</Link>
        : <div>{ children }</div>

    const content = prescriptions.map(prescription => {
        const files = JSON.parse(prescription.files)

        return (
            <div key={ prescription.id } className={ clsx(style.prescription_item, { [style.single_item]: singleMode }) }>
                <div className={ clsx(style.prescription_item_content) }>
                    <div className={ clsx(style.prescription_item_title) }>
                        <label htmlFor={ prescription.id.toString() }>
                            <input type="checkbox" className={ clsx(style.checkbox_item) }
                                   disabled={ user.id !== prescription.creator.id }
                                   hidden name="" id={ prescription.id.toString() }
                                   defaultChecked={ !!prescription.completed }
                                   onChange={ e => handleComplete(e, prescription.id, prescription.creator.id) }
                            />
                            <label htmlFor={ prescription.id.toString() }>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M5 13l4 4L19 7"/>
                                </svg>
                            </label>
                            <label htmlFor={ prescription.id.toString() }
                                   className={ clsx(style.checkbox_label, style.prescription_title_text) }>
                                { prescription.title }
                            </label>
                        </label>
                        {
                            user.id !== prescription.creator.id ? null :
                                <div className={ clsx(style.prescription_action_buttons) }>
                                    <Link to={ `/prescriptions/${ prescription.id }/edit` }
                                          onClick={() => setSelectedPrescription(prescription)}>
                                        <img src={ EditIcon } alt="" />
                                    </Link>
                                    <img src={ DeleteIcon } alt="" onClick={ () => open('ConfirmActionModal', {
                                        btnText: 'Удалить',
                                        modalData: { text: `Вы уверены, что хотите удалить предписание "${ prescription.title }"?` },
                                        onConfirm: () => handleDelete(prescription.id)
                                    }) } />
                                </div>
                        }
                    </div>
                    <WrapContent prescription={prescription}>
                        <p className={ clsx(style.prescription_executor) }>Исполнитель: <span>{ prescription.executor.name }</span></p>
                        <p className={ clsx(style.prescription_gray_text) }>{ moment(prescription.createdAt).format('lll') }</p>
                        <p className={ clsx(style.prescription_text) }>{ prescription.desc }</p>
                    </WrapContent>
                </div>
                {
                    files.length === 0 ? null : singleMode ?
                        <div className='px-20'>
                            <PrescriptionsFilesList files={files} />
                        </div> :
                        <div className={ clsx(style.prescription_files_amount, style.prescription_gray_text) }>
                            <img src="/img/static/pin-icon.png" alt=""/>
                            Прикреплено файлов { JSON.parse(prescription.files).length }
                        </div>
                }
            </div>
        )
    })

    return (
        <div className={ clsx(style.prescriptions) }>
            { content }
        </div>
    )
}

export type PrescriptionsFilesListPropsT = {
    files: File[] | string[]
}

export const PrescriptionsFilesList: React.FC<PrescriptionsFilesListPropsT> = ({ files }) => {
    const content = files.map((file, idx) => {
        let fileName = ''
        if (typeof file === 'string') {
            const filePath = file.split('/')
            fileName = filePath ? filePath[filePath.length - 1] : ''
        }

        return (
            <div key={ idx } className="form-file-item">
                <div className="flex-n-c">
                    <svg className='mr-10' width="32" height="32" viewBox="0 0 32 32" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0C6.9 0 6 0.9 6 2V30C6 31.1 6.9 32 8 32H28C29.1 32 30 31.1 30 30V8L22 0H8Z"
                              fill="#DFE3F1"/>
                        <path d="M24 8H30L22 0V6C22 7.1 22.9 8 24 8Z" fill="#B0B7BD"/>
                        <path d="M30 14L24 8H30V14Z" fill="#CAD1D8"/>
                    </svg>
                    {
                        typeof file === 'string' ?
                            fileName :
                            `${ file.name } (${ file.size } КБ)`
                    }
                </div>
                {
                    typeof file !== 'string' ? null :
                        <div className="flex-n-c">
                            <DocumentViewButton file={ file } />
                            <a href={ process.env.API_URL + '/api/v1/file?filename=' + fileName }
                               target='_blank' rel='noreferrer' download>
                                <svg xmlns="http://www.w3.org/2000/svg" className="" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px', margin: 0 }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 }
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                            </a>
                        </div>
                }
            </div>
        )
    })

    return <div className='form-files-list'>{ content }</div>
}