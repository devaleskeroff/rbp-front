import React, { FC, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from 'effector-react'
// STORE
import { $User, UserRoleEnum } from '@store/user-store'
// TYPES
import { MenuItemsPropsType, MenuPanelPropsT } from '@interfaces/common'
import { UserDataT } from '@interfaces/user'
// STYLES
import '@scss/components/menu.scss'

const MenuItems: any = (props: MenuItemsPropsType) => {
   const { url, onItemClick } = props

   return props.items.map((item, idx) => {
      const { text, imageSrc, notification, link } = item
      const regExp = new RegExp(link, 'i')
      const active = url.match(regExp)

      return (
         <Link key={idx} to={link}>
            <p className={`menu-item ${active ? 'active' : ''} ${notification ? 'notification' : ''}`}
               onClick={() => onItemClick(link)}>
                <img src={ imageSrc } alt="" className='menu-item-icon' />
                { text }
            </p>
         </Link>
      )
   })
}

const MenuPanel: FC<MenuPanelPropsT> = ({ active, onItemClick }) => {
   const user = useStore($User) as UserDataT

   useEffect(() => {
      onItemClick(window.location.href)
   }, [])

   let menuItems = [
      { imageSrc: '/img/static/company-icon.png', text: 'Компания', link: '/company' },
      { imageSrc: '/img/static/study-center-icon.png', text: 'Учебный центр', link: '/study-center' },
      { imageSrc: '/img/static/notifications-icon.png', text: 'Оповещения', link: '/notifications' },
      { imageSrc: '/img/static/news-icon.png', text: 'Новости', link: '/news' },
      { imageSrc: '/img/static/help-icon.png', text: 'Помощь специалисту', link: '/help' },
      { imageSrc: '/img/static/responsibility-icon.png', text: 'Ответственность', link: '/responsibility' },
      { imageSrc: '/img/static/judicial-practice-icon.png', text: 'Судебная практика', link: '/practices' },
      { imageSrc: '/img/static/payment-icon.png', text: 'Оплата', link: '/payment' },
      { imageSrc: '/img/static/qa-icon.png', text: 'Вопрос специалисту', link: '/question-answer' }
   ]

   if (user.role === UserRoleEnum.Admin || user.role === UserRoleEnum.SuperAdmin) {
      menuItems.unshift({ imageSrc: '/img/static/users.png', text: 'Пользователи', link: '/users' })
   }
   if (user.role !== UserRoleEnum.Client) {
      const newMenuItems = []
      for (let i = 0; i < menuItems.length; i++) {
         newMenuItems.push(menuItems[i])
         if (i === 1) {
            newMenuItems.push({ imageSrc: '/img/static/specialist-plan-icon.png', text: 'План специалиста ', link: '/specialist-plan' },)
         }
      }
      newMenuItems.push({ imageSrc: '/img/static/prescription.png', text: 'Предписания', link: '/prescriptions' })
      menuItems = newMenuItems
   }

   return (
      <nav className='menu'>
         <div className="menu-cont">
            <div className="menu-section">
               <MenuItems url={active} onItemClick={onItemClick} items={menuItems} />
            </div>
            <div className="menu-section">
               <MenuItems url={active} onItemClick={onItemClick} items={[
                  { imageSrc: '/img/static/feedback-icon.png', text: 'Техподдержка', link: '/feedback' },
               ]} />
            </div>
         </div>
      </nav>
   )
}

export default MenuPanel