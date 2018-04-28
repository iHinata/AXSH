import Vue, { ComponentOptions } from 'vue';
import Router from 'vue-router';
import { context } from '@utils/context';

function view(name: string): ComponentOptions<Vue> {
    return resolve => require([`../views/${name}`], resolve);
}

Vue.use(Router);
export default new Router({
    mode: "history",
    base: context,
    routes: [{
        path: '/loop',
        name: 'loop',
        component: view('Loop')
    }, {
        path: '/login',
        name: 'login',
        component: view('Login')
    }, {
        path: '/',
        component: view('App'),
        redirect: {
            name: 'login'
        },
        children: [{
            path: '/home',
            name: 'home',
            meta: { title: '', showHeader: false, auth: true },
            component: view('Home')
        }, {
            path: '/platform',
            name: 'platform',
            meta: { title: '平台产品概况', showHeader: true, auth: true },
            component: view('Platform')
        }, {
            path: '/running',
            name: 'running',
            meta: { title: '产品运维概况', showHeader: true, auth: true },
            component: view('Running')
        }, {
            path: '/data',
            name: 'data',
            meta: { title: '数据建设分析', showHeader: true, auth: true },
            component: view('Data')
        }, {
            path: '/apps',
            name: 'apps',
            meta: { title: '应用运行分析', showHeader: true, auth: true },
            component: view('Apps')
        },{
            path: '/schoolMonitor',
            name: 'schoolMonitor',
            meta: { title: '应用运行分析', showHeader: false, auth: true },
            component: view('SchoolMonitor')
        }, {
            path: '/index',
            name: 'index',
            meta: { title: '首页', showHeader: false, auth: true, nobg: true },
            component: view('Index'),
            children: [{
                path: 'list',
                name: 'list',
                meta: { title: '列表', showHeader: false, auth: true, nobg: true },
                component: view('Products')
            }, {
                path: 'map',
                name: 'map',
                meta: { title: '大屏列表', showHeader: false, auth: true, nobg: true },
                component: view('Map')
            }, {
                path: 'screenlist/:schoolCode/:token',
                name: 'screenlist',
                props: true,
                meta: { title: '用户大屏列表', showHeader: false, auth: true, nobg: true },
                component: view('UserScreen')
            }]
        }]
    }]
});
