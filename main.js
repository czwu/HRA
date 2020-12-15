import Vue from 'vue'
import App from './App'
import store from './store'
import baseService from './service/base'
import catalogService from './service/filesys/catalog'
import util from './common/util'
Vue.config.productionTip = false

Vue.prototype.$store = store;
Vue.filter('timeString', function(value) {
    return value ? util.dateFormat('hh:mm:ss', new Date(value * 1000)) : ""
});
Vue.filter('timeStringDefault', function(value) {
    return value ? util.dateFormat('hh:mm:ss', new Date(value * 1000)) : "00:00:00"
});
Vue.filter('dateString', function(value, format) {
    if (typeof value == 'string') {
        return value
    }
    return value ? util.dateFormat(format || 'yyyy-MM-dd hh:mm', new Date(value * 1000)) : ''
});
Vue.filter('fileSplit', function(file) {
    return file.split("/").pop();
});
Vue.filter('filePathRender', function(guid) {
    return catalogService.renderPathById(guid)
});

App.mpType = 'app'
baseService.prototype.openDataBase(() => {
    const app = new Vue({
        store,
        ...App
    })
    app.$mount()
})