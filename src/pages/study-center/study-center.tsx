import { useCallback, useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import clsx from 'clsx'
// COMPONENTS
import { BreadCrumb } from '@components/common'
import { ColorfulButton, Title } from '@components/common/common'
// STORE
import { $UserRole, UserRoleEnum } from '@store/user-store'
import {
   $CourseItems,
   $CourseStates,
   fetchCourseItems,
   pushToCourses,
   setCourseStates,
   setCourseStoreData
} from '@store/study-store'
// TYPES
import { CourseT } from '@interfaces/study-center'
// STYLES
import style from '@scss/pages/study-center.module.scss'

const itemsPerPage = 8

const StudyCenter = () => {
   // STORES
   const userRole = useStore($UserRole)
   const { courses: commonCourses, coursesCount, webinarsCount } = useStore($CourseItems)
   const { isLoading, isFetched, error } = useStore($CourseStates)
   // STATES
   const [offsets, setOffsets] = useState({
      commonOffset: 0,
      coursesOffset: 0,
      webinarsOffset: 0
   })
   const [category, setCategory] = useState<string | null>(null)
   const [currentCourses, setCurrentCourses] = useState<CourseT[]>([])
   const [courses, setCourses] = useState<CourseT[]>([])
   const [webinars, setWebinars] = useState<CourseT[]>([])
   const [currentCoursesCount, setCurrentCoursesCount] = useState(0)
   const [states, setStates] = useState({
      coursesFetched: false,
      webinarsFetched: false
   })

   useEffect(() => {
      if (!isFetched) {
         fetchCourseItems({
            offset: commonCourses.length,
            limit: itemsPerPage,
            count: true,
            cb: (err, res) => {
                if (err || !res) {
                   return console.log('При получении курсов произошла ошибка')
                }
               setOffsets({ ...offsets, commonOffset: itemsPerPage })
               setCourseStoreData(res.data)
               setCurrentCoursesCount(res.data.coursesCount + res.data.webinarsCount)
               setCurrentCourses(res.data.courses)
            }
         })
      }
   }, [])

   useEffect(() => {
      if (!category) {
         return setCurrentCourses(commonCourses)
      }
      if (category === 'WEBINAR') {
         return setCurrentCourses(webinars)
      }
      if (category === 'COURSE') {
         return setCurrentCourses(courses)
      }
   }, [courses, webinars, commonCourses])

   const fetchMoreCourses = useCallback(() => {
      let offset: number
      let type: any
      switch (category) {
         case 'WEBINAR':
            type = 'WEBINAR'
            offset = offsets.webinarsOffset
            if (!states.webinarsFetched) setCourseStates({ isFetched: true, isLoading: true, error: false })
            break
         case 'COURSE':
            type = 'COURSE'
            offset = offsets.coursesOffset
            if (!states.coursesFetched) setCourseStates({ isFetched: true, isLoading: true, error: false })
            break
         default:
            type = undefined
            offset = offsets.commonOffset
      }

      fetchCourseItems({
         offset,
         limit: itemsPerPage,
         type,
         cb: (err, res) => {
            if (err || !res) {
               return console.log('Произошла ошибка при получении событий')
            }
            setCourseStates({ isFetched: true, isLoading: false, error: false })

            if (type === 'COURSE') {
               if (!states.coursesFetched) {
                  setStates({ ...states, coursesFetched: true })
               }
               setCourses([...courses, ...res.data.courses])
               setOffsets({ ...offsets, coursesOffset: offset + res.data.courses.length })
               return
            }
            if (type === 'WEBINAR') {
               if (!states.webinarsFetched) {
                  setStates({ ...states, webinarsFetched: true })
               }
               setWebinars([...webinars, ...res.data.courses])
               setOffsets({ ...offsets, webinarsOffset: offset + res.data.courses.length })
               return
            }
            setOffsets({ ...offsets, commonOffset: offset + res.data.courses.length })
            pushToCourses(res.data.courses)
         }
      })
   }, [category, offsets, states])

   useEffect(() => {
      if (!category) {
         setCurrentCoursesCount(coursesCount + webinarsCount)
         return setCurrentCourses(commonCourses)
      }
      if (category === 'WEBINAR') {
         setCurrentCoursesCount(webinarsCount)
         setCurrentCourses(webinars)
         if (!states.webinarsFetched) {
            fetchMoreCourses()
         }
         return
      }
      if (category === 'COURSE') {
         setCurrentCoursesCount(coursesCount)
         setCurrentCourses(courses)
         if (!states.coursesFetched) {
            fetchMoreCourses()
         }
         return
      }
   }, [category])

   const categoryChangingHandler = ({ target }: any) => {
      let selectedCategory: null | string = target.getAttribute('datatype')

      selectedCategory = selectedCategory === 'ANY' ? null : selectedCategory
      setCategory(selectedCategory)
   }

   return (
      <main className='content-container'>
         <div className='content-section'>
            <div className="top-content">
               <BreadCrumb items={ ['Главная', 'Учебный центр'] }/>
               <div className="content-title-section-with-btn">
                  <Title text='Учебный центр' />
                  {
                     userRole !== UserRoleEnum.SuperAdmin ? null :
                         <ColorfulButton link={'/study-center/create'} text={'Добавить курс'} />
                  }
               </div>
            </div>
            <section className={ clsx(style.study_content) }>
               <div className={ clsx(style.study_content__promo) }>
                  <img src="/img/static/study-center-img.jpg" alt="" />
               </div>
               <div className={ clsx(style.download_doc_section) }>
                  <p className={ clsx(style.download_doc__title) }>Подать заявку на обучение</p>
                  <p className={ clsx(style.download_doc__title) }>И получите доступ ко всем курсам!</p>
                  <div>
                     <a href={ process.env.API_URL + '/uploads/files/static/zayavka.doc' } download 
                        className={`green-colorful-btn ${ clsx(style.download_doc_btn) }`}>
                        Скачать заявку
                        <svg style={{ width: '15px', height: '15px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                     </a>
                  </div>
               </div>
               {/* <Categories onClick={ categoryChangingHandler } items={ [
                  { value: 'ANY', label: 'Все' },
                  { value: 'COURSE', label: 'Курсы' },
                  { value: 'WEBINAR', label: 'Вебинары' }
               ] }/> */}
               {/* {
                  courseTags ?
                     <Tags selectedTag={tag} items={['Все темы', ...courseTags]} onClick={onTagClick} />
                     : null
               } */}
               {/* {
                  error ? <ErrorIndicator/> : isLoading ? <Loader/> :
                      <CourseItems items={ currentCourses }/>
               } */}
               {/* {
                  !isLoading && currentCourses.length < currentCoursesCount ?
                      <button className='pagination-button' onClick={ fetchMoreCourses }>
                         Показать еще
                      </button> : null
               } */}
            </section>
         </div>
      </main>
   )
}

export default StudyCenter