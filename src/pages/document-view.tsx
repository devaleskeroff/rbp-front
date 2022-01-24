import React, { ChangeEvent, useEffect } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { BreadCrumb, TableTopPanel } from '@components/common'
import { Title } from '@components/common/common'
// STORE
import { $Document, fetchDocumentData, putDocumentCheckbox } from '@store/document-store'
// STYLES
import style from '@scss/document-view.module.scss'

const getDocumentPriodicty = (value: number) => {
    switch (value) {
       case 1001:
          return 'Разово'
       case 1002:
          return 'Квартал'
       case 1003:
          return 'Раз в месяц'
       case 1004:
          return 'Полгода'
       case 1005:
          return 'Год'
       default:
          return ''
    }
}

const onChecked = (e: ChangeEvent<HTMLInputElement>, id: number, type: 'unit' | 'group') => {
   putDocumentCheckbox({
      checked: e.target.checked,
      id,
      type
   })
}

const DocumentView = () => {
   const Document = useStore($Document)

   useEffect(() => {
       fetchDocumentData()
   }, [])

    return (
       <main className='content-container'>
          <div className='content-section'>
             <div className="top-content">
                <BreadCrumb items={ ['Главная', 'Компания', 'Защита персональных данных'] }/>
                <Title text='Документ' />
             </div>
             <div className={clsx(style.document_view__blocks)}>
                {/* FIRST BLOCK */}
                <section className={clsx(style.document_view__section)}>
                   <div className={clsx(style.document_view__section_top_panel)}>
                      <p className={clsx(style.document_name)}>
                         <img src="/img/pdf.png" alt="" />
                         {
                            Document === null ? 'Идет загрузка...' :
                                Document === false ? 'При загрузке данных произошла ошибка.' :
                                    Document.document.name
                         }
                      </p>
                      <div className={clsx(style.document_view__buttons)}>
                         <button className={clsx(style.document_view__button)}>
                            <img src="/img/eye.png" alt="" />
                         </button>
                         <button className={clsx(style.document_view__button)}>
                            <img src="/img/edit.png" alt="" />
                         </button>
                         <button className={clsx(style.document_view__button)}>
                            <img src="/img/archive.png" alt="" />
                         </button>
                      </div>
                   </div>
                   <button className={clsx(style.send_to_signature_btn)}>Отправить на подпись</button>
                   <p className={clsx(style.key_value_item)}>
                      Дата создания: <span>
                      {
                         Document === null ? 'Идет загрузка...' :
                             Document === false ? 'При загрузке данных произошла ошибка.' :
                                 Document.document.created_at
                      }
                   </span>
                   </p>
                   <p className={clsx(style.key_value_item)}>
                      Периодичность: <span>
                      {
                         Document === null ? 'Идет загрузка...' :
                             Document === false ? 'При загрузке данных произошла ошибка.' :
                                 getDocumentPriodicty(Document.document.periodicity)
                      }
                   </span>
                   </p>
                </section>
                {/* SECOND BLOCK */}
                <section className={clsx(style.document_view__section)}>
                   <p className={clsx(style.block_title)}>Принадлежность к подразделениям</p>
                   <div key={'all_units'} className="flex-n-c mt-15">
                      <input type="checkbox" className="checkbox-item" hidden name="" id={'all_units'}
                      onChange={e => onChecked(e, 0, 'unit')}/>
                      <label htmlFor={'all_units'}>
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                         </svg>
                      </label>
                      <label htmlFor={'all_units'} className="checkbox-label">Все подразделения</label>
                   </div>
                   {
                      Document === null ? 'Идет загрузка...' :
                          Document === false ? 'При загрузке данных произошла ошибка.' :
                              Document.units.map(unit => (
                                  <div key={unit.id} className="flex-n-c mt-15">
                                     <input type="checkbox" className="checkbox-item" hidden name="" id={unit.name}
                                     defaultChecked={!!Document.document.units.find(id => id === unit.id)}
                                     onChange={el => onChecked(el, unit.id, 'unit')} />
                                     <label htmlFor={unit.name}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                     </label>
                                     <label htmlFor={unit.name} className="checkbox-label">{ unit.name }</label>
                                  </div>
                              ))
                   }
                </section>
                {/* THIRD BLOCK */}
                <section className={clsx(style.document_view__section)}>
                   <p className={clsx(style.block_title)}>Принадлежность к группам</p>
                   <div key={'all_groups'} className="flex-n-c mt-15">
                      <input type="checkbox" className="checkbox-item" hidden name="" id={'all_groups'}
                      onChange={e => onChecked(e, 0, 'group')} />
                      <label htmlFor={'all_groups'}>
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                         </svg>
                      </label>
                      <label htmlFor={'all_groups'} className="checkbox-label">Все группы</label>
                   </div>
                   {
                      Document === null ? 'Идет загрузка...' :
                          Document === false ? 'При загрузке данных произошла ошибка.' :
                              Document.groups.map(group => (
                                  <div key={group.id} className="flex-n-c mt-15">
                                     <input type="checkbox" className="checkbox-item" hidden name="" id={group.name}
                                     defaultChecked={!!Document.document.units.find(id => id === group.id)}
                                     onChange={el => onChecked(el, group.id, 'group')} />
                                     <label htmlFor={group.name}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                     </label>
                                     <label htmlFor={group.name} className="checkbox-label">{ group.name }</label>
                                  </div>
                              ))
                   }
                </section>
             </div>
             <h5 className={clsx(style.signature_history_title)}>История подписаний</h5>
             <div className={clsx(style.document_table)}>
                <TableTopPanel onSelectOption={() => console.log('clicked')}
                               text={`${ (Document && Document?.document.signature.length) || 0 } подписей`}
                               hideSearchPanel
                               options={[
                                  {
                                     value: 30,
                                     label: 'По именам'
                                  },
                                  {
                                     value: 40,
                                     label: 'Дата подписки'
                                  },
                               ]} />
                <div className="table-container">
                   <table className='tab-table with-last-row'>
                      <thead>
                      <tr>
                         <td>
                            <label>
                               <input type="checkbox" className="checkbox-item" hidden name="" disabled />
                               <label className="">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                       xmlns="http://www.w3.org/2000/svg">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                               </label>
                               <label className="checkbox-label">Сотрудник</label>
                            </label>
                         </td>
                         <td>Дата подписи</td>
                         <td>Дата подписи 2</td>
                         <td>Дата подписи 3</td>
                         <td />
                      </tr>
                      </thead>
                      <tbody>
                      {
                         Document === null ? <tr><td>Идет загрузка...</td></tr> :
                             Document === false ? <tr><td>При загрузке данных произошла ошибка.</td></tr> :
                                 Document.document.signature.map(signature => (
                                     <tr key={signature.id}>
                                        <td>
                                           <label key={signature.id} htmlFor={`${signature.id}`}>
                                              <input type="checkbox" className="checkbox-item" hidden name="" id={`${signature.id}`} />
                                              <label htmlFor={`${signature.id}`}>
                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                      xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                 </svg>
                                              </label>
                                              <label htmlFor={`${signature.id}`} className="checkbox-label">{ signature.employee.name }</label>
                                           </label>
                                        </td>
                                        <td>{ signature.date_signature }</td>
                                        <td>{ signature.date_signature } 22</td>
                                        <td>{ signature.date_signature } 33</td>
                                        <td className='tool-row'>
                                           {
                                              signature.status === 'no_signature' || signature.status === 'expired' ?
                                                  <button className={clsx(style.send_to_signature_btn)}>Отправить на подпись</button> :
                                                  signature.status === 'no_verified' ?
                                                      <button className={clsx(style.send_to_signature_btn)}>Ожидает подписи</button> :
                                                      signature.status === 'verified' ?
                                                          <button className={clsx(style.send_to_signature_btn)} disabled>Подписано</button> : null
                                           }
                                           <button className={clsx(style.document_view__button)}>
                                              <img src="/img/archive.png" alt=""/>
                                           </button>
                                        </td>
                                     </tr>
                                 ))
                      }
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
       </main>
    )
}

export default DocumentView
