import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
// COMPONENTS
import { BreadCrumb } from '@components/common'
import { Title } from '@components/common/common'
// STORE
import $QAItems, { fetchQAItems } from '@store/qusetion-answer-store'
// TYPES
import { QAItemT } from '@interfaces/question-answer'
// STYLES
import '@scss/pages/question-answer.scss'

const QATabs = ({ items }: { items: QAItemT[] }) => {
   const toggleTab = (e: any) => {
      const tab = e.target.closest('.qa-tab__item')
      tab.classList.toggle('active')
   }

   const content = items.map((tab, idx) => {
      return (
          <div key={idx} className="qa-tab__item shadow-sm">
             <div className="qa-tab__trigger" onClick={toggleTab} >
                <img src="/img/static/green-arrow_drop_down.png" alt="" className="qa-tab__arrow"/>
                <p className="qa-tab__title">{ tab.title }</p>
             </div>
             <div className="qa-tab__content">
                <div className="">{ tab.description }</div>
             </div>
          </div>
      )
   })

   return (
       <section className="qa-tab-items">
          { content }
       </section>
   )
}

const QuestionAnswer = () => {
   // const QAItems = useStore($QAItems)
    const QAItems = [{ title: 'Вопрос', description: 'Ответ' }]

   useEffect(() => {
      // fetchQAItems()
   }, [])

   return (
       <main className="content-container">
          <div className="content-section">
             <div className="top-content">
                <BreadCrumb items={ ['Главная', 'Вопрос-ответ'] }/>
                 <Title text='Вопрос-ответ' />
             </div>
              <QATabs items={QAItems} />
             {/*{*/}
             {/*   QAItems === null ? 'Loading...' :*/}
             {/*       QAItems === false ? 'Произошла ошибка' : <QATabs items={QAItems} />*/}
             {/*}*/}
          </div>
       </main>
   )
}

export default QuestionAnswer