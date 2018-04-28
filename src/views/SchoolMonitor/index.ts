import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import WithRender from './schoolMonitor.html?style=./schoolMonitor.scss';
import Card from '@components/Card';
import MapChart from '@components/MapChart';
import PieChart from '@components/PieChart';
import BarChart from '@components/BarChart';
import LineChart from '@components/LineChart';
import NumCardGroup from '@components/NumCardGroup';
import Rating from '@components/Rating';
import TimeDisplay from '@components/TimeDisplay';
import create from '@utils/websocket';
import dataFormat, { splitNumber } from '@utils/dataFormat';
import echarts from 'echarts';

import { APPS_HIGH_SCORE, APPS_HIGH_SCORE_COMMET, APPS_HIGH_PVUV } from '@store/Constants';

@WithRender
@Component({
    components: { Card, MapChart, PieChart, BarChart, LineChart, NumCardGroup, Rating, TimeDisplay }
})
export default class Apps extends Vue {
    current = 0;
    split = 100;

    school_num = 0;
    allPVs = [];
    allUVs = [];

    top5 = [];
    pcAppTop5 = [];
    mobileAppTop5 = [];

    get allPV() {
        return this.allPVs[this.current] || 0;
    }
    get allUV() {
        return this.allUVs[this.current] || 0;
    }

    mobile_app_num = 0;
    pc_app_num = 0;
    app_num = 0;
    all_app_num = 0;

    appCatagoryUseStatisc = [];
    area: ChartItem[] = [];
    appCategroy = [];
    teacherWay = [];
    studentWay = [];
    studentUseApp = [];
    teacherUseApp = [];
    studentUseBrowser = [];
    teacherUseBrowser = [];

    mounted() {
        setInterval(() => {
            if (this.current >= this.split - 1) {
                this.current = this.split - 1
            } else {
                this.current++
            }
            console.log('current:'+this.current)
            console.log('allPV:'+this.allPV)
        }, 3000);

    }

    created() {

        create().subscribe('/topic/appAnalysis', res => {
            this.school_num = res.AppDevSchoolTotal.dataSet[0].school_num
            this.mobile_app_num = res.AppDevAppStatisc.dataSet[0].mobile_app_num
            this.pc_app_num = res.AppDevAppStatisc.dataSet[0].pc_app_num
            this.app_num = res.AppDevAppStatisc.dataSet[0].app_num
            this.all_app_num = this.pc_app_num + this.mobile_app_num

            this.appCategroy = res.AppDevAppCategroyStatisc.dataSet.map(data => {
                return {
                    name: data.category_name + '  ' + data.app_num,
                    value: data.app_num || 0
                }
            }).slice(0, 10)
            this.teacherWay = res.TeacherUserLoginTypeStatisc.dataSet.map(data => {
                return {
                    name: data.login_type,
                    value: data.user_num || 0
                }
            })
            this.studentWay = res.StudentUserLoginTypeStatisc.dataSet.map(data => {
                return {
                    name: data.login_type,
                    value: data.user_num || 0
                }
            })

            let pvs = res.AppDevTotalAccessStatisc.dataSet[0].tpv + res.AppDevTotalAccessStatisc.dataSet[0].spv
            let uvs = res.AppDevTotalAccessStatisc.dataSet[0].tuv + res.AppDevTotalAccessStatisc.dataSet[0].suv

            this.allPVs = splitNumber(this.allPV, pvs || 0, this.split);
            this.allUVs = splitNumber(this.allUV, uvs || 0, this.split);
            this.current = 0
            console.log(this.allPVs)

            this.studentUseApp = res.StudentAppUseTopN.dataSet.splice(0, 10)
            this.teacherUseApp = res.TeacherAppUseTopN.dataSet.splice(0, 10)

            this.appCatagoryUseStatisc = res.AppCatagoryUseStatisc.dataSet.splice(0, 5)

            let studentMax = 0;
            let teacherMax = 0;
            res.StudentUserBrowserStatisc.dataSet.forEach(data => data.user_num > studentMax ? studentMax = data.user_num : 0);
            this.studentUseBrowser = res.StudentUserBrowserStatisc.dataSet.map(data => {
                return {
                    name: data.browser,
                    value: Math.round(data.user_num / studentMax * 100),
                    label: data.user_num
                }
            })
            res.TeacherUserBrowserStatisc.dataSet.forEach(data => data.user_num > teacherMax ? teacherMax = data.user_num : 0);
            this.teacherUseBrowser = res.TeacherUserBrowserStatisc.dataSet.map(data => {
                return {
                    name: data.browser,
                    value: Math.round(data.user_num / teacherMax * 100),
                    label: data.user_num
                }
            })

            this.area = res.UserAreaProvinceAnalysis.dataSet.map(data => {
                let i = data.province.indexOf('省') || data.province.indexOf('市')
                return {
                    name: i > 0 ? data.province.substring(0, i) : data.province,
                    value: data.uv || 0
                }
            })

            this.pcAppTop5 = res.PCAppDevAppTop5.dataSet.map(ele => {
                let arr = ele.topNSchoolList.split(',')
                return {
                    school_num: ele.school_num,
                    uv: ele.school_num,
                    list: arr,
                    pv: ele.pv,
                    schoolid: ele.schoolid,
                    APP_NAME: ele.APP_NAME,
                    app_id: ele.app_id,
                    version: ele.version,
                    iconUrl: ele.iconUrl || '',
                    category: ele.category,
                }
            })

            this.mobileAppTop5 = res.MobileCAppDevAppTop5.dataSet.map(ele => {
                let arr = ele.topNSchoolList.split(',')
                return {
                    school_num: ele.school_num,
                    uv: ele.uv,
                    list: arr,
                    pv: ele.pv,
                    schoolid: ele.schoolid,
                    app_name: ele.app_name,
                    app_id: ele.app_id,
                    version: ele.version,
                    iconUrl: ele.iconUrl || '',
                    category: ele.category,
                }
            })

            

        })
    }
}
