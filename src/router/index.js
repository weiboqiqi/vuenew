import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/home'
import Details from '../components/details'
import Details1 from '../components/details1'
import Map from '../components/map'
Vue.use(Router)
export default new Router({
    //mode: 'history',
    routes: [
        {
            path: '/',
            component: Index
        },
        {
            name: 'details',
            path: '/details',
            component: Details
        },
        {
            name: 'details1',
            path: '/details1',
            component: Details1
        },
        {
            name: 'map',
            path: '/map',
            component: Map
        }
    ]
})
