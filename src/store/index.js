import Vue from 'vue'
import Vuex from 'vuex'

import {update} from '../api/store';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        showToast: false,
        text: '',
        callBack1: {},
        callBack2: {}
    },
    mutations: {
        update(state, config){
            state[config[0]] = config[1];
        }
    },
//异步操作并不是必须放在actions中，最终触发的都是mutations
//    actions: {
//        uploadInfo({commit}, data){
//            commit('uploadInfo', data)
//        }
//    }
})
export default store
