import { useStore } from 'effector-react'
import {
   $modal,
   $modalComponent,
   $modalData,
   setModalComponent,
   setModalData,
   setModalDisplay
} from '@store/modal-store'
import { ModalItemEnum, OpenModalPropsT } from '@interfaces/modals'


const useModal = () => {
   const modal = useStore($modal)
   const modalComponent = useStore($modalComponent)
   const modalData = useStore($modalData)

   const open = (modalName: ModalItemEnum, options: OpenModalPropsT = {}) => {
      setModalComponent({
         key: options.key,
         component: modalName,
         btnText: options.btnText,
         onConfirm: options.onConfirm || null
      })
      setModalData(options.modalData || {})
      setModalDisplay(true)
   }

   const close = () => {
      setModalDisplay(false)
   }

   return { modal, modalComponent, modalData, open, close }
}

export default useModal