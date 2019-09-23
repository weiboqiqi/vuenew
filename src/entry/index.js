//常用依赖，分享sdk，webview
require("../common/js/base")
//require('../common/js/share-sdk-v2.0')
//require('../common/js/webview.v4.0.min')

import Vue from 'vue'
import App from './App'
import router from '../router'
import store from '../store'
import FastClick from 'fastclick'
import CONST from '../const'


Vue.config.productionTip = false;
//Vue和axios默认设置
//Vue.config.devtools = false

new Vue({
    el: '#app',
    mounted(){
        FastClick.attach(document.body);
    },
    router,
    store,
    template: '<App/>',
    components: {App}
})
