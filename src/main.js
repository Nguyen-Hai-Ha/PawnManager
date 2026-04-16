import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { permissionDirective } from './directives/permission'

import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faUser, faChartLine, faFileSignature,
    faCarSide, faUsersGear, faFileInvoiceDollar,
    faRotate, faSort, faSortUp, faSortDown, faPenToSquare, faCircleXmark,
    faAnglesLeft, faAngleLeft, faAngleRight, faAnglesRight,
    faCoins, faEye, faGavel, faUserLock, faTrashCan,
    faLock, faEyeSlash, faCircleExclamation, faHandHoldingDollar, faMoneyBillWave,
    faUserTie, faTimes, faFileInvoice, faPrint, faFileContract, faReceipt, faGears,
    faPiggyBank, faCalculator, faLandmark, faCreditCard, faBell, faTags, faDownload,
    faPaperPlane, faFloppyDisk, faPlus, faFileWord, faCalendarAlt, faChevronRight, faFileExcel,faFileImport
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faUser, faChartLine, faFileSignature,
    faCarSide, faUsersGear, faFileInvoiceDollar,
    faRotate, faSort, faSortUp, faSortDown, faPenToSquare, faCircleXmark,
    faAnglesLeft, faAngleLeft, faAngleRight, faAnglesRight,
    faCoins, faEye, faGavel, faUserLock, faTrashCan,
    faLock, faEyeSlash, faCircleExclamation, faHandHoldingDollar, faMoneyBillWave,
    faUserTie, faTimes, faFileInvoice, faPrint, faFileContract, faReceipt, faGears,
    faPiggyBank, faCalculator, faLandmark, faCreditCard, faBell, faTags, faDownload,
    faPaperPlane, faFloppyDisk, faPlus, faFileWord, faCalendarAlt, faChevronRight, faFileExcel,faFileImport
)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Viewer, {
    defaultOptions: {
    toolbar: {
      zoomIn: 1,
      zoomOut: 1,
      oneToOne: 1,
      reset: 1,
      prev: 0,
      play: { show: 0, size: 'large' },
      next: 0,
      rotateLeft: 1,
      rotateRight: 1,
      flipHorizontal: 1,
      flipVertical: 1,
    },
  }
})
app.component('font-awesome-icon', FontAwesomeIcon)
app.directive('permission', permissionDirective)
app.mount('#app')