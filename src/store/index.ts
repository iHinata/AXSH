import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@utils/axios';
import login from './modules/login';
import apps from './modules/apps';
import running from './modules/running';
import products from './modules/products';
import bigScreen from './modules/bigScreen';


Vue.use(Vuex)

const state = {
}


const mutations = {
}

const actions = {

}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {
        login,
        apps,
        running,
        products,
        bigScreen,
    }
})
