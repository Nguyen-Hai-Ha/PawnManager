import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { permissionDirective } from './directives/permission'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faChartLine, faFileSignature,
    faCarSide, faUsersGear, faFileInvoiceDollar,
    faRotate
} from '@fortawesome/free-solid-svg-icons'

library.add( faUser, faChartLine, faFileSignature,
     faCarSide, faUsersGear, faFileInvoiceDollar,
     faRotate
    )

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.mount('#app')
app.directive('permission', permissionDirective)