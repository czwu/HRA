import Vue from 'vue'
import App from './App'
import store from './store'
import baseService from './service/base'
Vue.config.productionTip = false

Vue.prototype.$store = store
App.mpType = 'app'
baseService.prototype.openDataBase(() => {
    const app = new Vue({
        store,
        ...App
    })
    app.$mount()
})