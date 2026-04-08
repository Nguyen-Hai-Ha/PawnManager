import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { permissionDirective } from './directives/permission'

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
    faPiggyBank, faCalculator, faLandmark, faCreditCard
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faUser, faChartLine, faFileSignature,
    faCarSide, faUsersGear, faFileInvoiceDollar,
    faRotate, faSort, faSortUp, faSortDown, faPenToSquare, faCircleXmark,
    faAnglesLeft, faAngleLeft, faAngleRight, faAnglesRight,
    faCoins, faEye, faGavel, faUserLock, faTrashCan,
    faLock, faEyeSlash, faCircleExclamation, faHandHoldingDollar, faMoneyBillWave,
    faUserTie, faTimes, faFileInvoice, faPrint, faFileContract, faReceipt, faGears,
    faPiggyBank, faCalculator, faLandmark, faCreditCard
)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.directive('permission', permissionDirective)
app.mount('#app')