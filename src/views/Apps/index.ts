import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import {Action, State} from 'vuex-class';
import WithRender from './apps.html?style=./apps.scss';
import Card from '@components/Card';
import MapChart from '@components/MapChart';
import PieChart from '@components/PieChart';
import BarChart from '@components/BarChart';
import LineChart from '@components/LineChart';
import NumCardGroup from '@components/NumCardGroup';
import Rating from '@components/Rating';
import create from '@utils/websocket';
import dataFormat, {splitNumber} from '@utils/dataFormat';
import {APPS_HIGH_SCORE, APPS_HIGH_SCORE_COMMET, APPS_HIGH_PVUV} from '@store/Constants';


@WithRender
@Component({
  components: {Card, MapChart, PieChart, BarChart, LineChart, NumCardGroup, Rating}
})
export default class Apps extends Vue {
  date = new Date();
  rn = 0;
  schoolTotal = 0;
  appTotal = 0;
  pcAppTotal = 0;
  mobileAppTotal = 0;
  appIncrease = 0;
  appCategories: ChartItem[] = [];
  studentUseTimes = 0;
  studentSuggestTimes = 0;
  teacherUseTimes = 0;
  teacherSuggestTimes = 0;
  schoolTop5 = [];
  appTop5 = [];
  current = 0;
  split = 200;
  studentAccessPVs = [];
  studentAccessUVs = [];
  teacherAccessPVs = [];
  teacherAccessUVs = [];
  get studentAccessPV() {
    return this.studentAccessPVs[this.current] || 0;
  }
  get studentAccessUV() {
    return this.studentAccessUVs[this.current] || 0;
  }
  get teacherAccessPV() {
    return this.teacherAccessPVs[this.current] || 0;
  }
  get teacherAccessUV() {
    return this.teacherAccessUVs[this.current] || 0;
  }

  @Action(APPS_HIGH_SCORE) queryHighScoreApp: Function;
  @State(state => state.apps.app) highScoreApp;
  @Action(APPS_HIGH_SCORE_COMMET) queryHighScoreCommets: Function;
  @State(state => state.apps.commets) commets: any[];
  @Action(APPS_HIGH_PVUV) queryPvUv: Function;
  @State(state => state.apps.pvuv) pvuv;

  currentCommetIndex = 0;
  timer = null;

  @Watch('highScoreApp')
  onHighScoreAppChange(nApp) {
    this.queryPvUv(nApp.app_id);
    this.queryHighScoreCommets(nApp.app_id)
      .then(() => {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          this.currentCommetIndex = (this.currentCommetIndex + 1) % this.commets.length;
          if (this.currentCommetIndex === this.commets.length - 1) {
            this.rn = (this.rn + 1) % this.highScoreApp.app_total;
            this.queryHighScoreApp(this.rn + 1)
          }
        }, 5000);
      });
    }

  showCommet = [];

  @Watch('currentCommetIndex')
  onCurrentCommetIndex(nIndex) {
    const commet = this.commets[this.currentCommetIndex];
    if (commet) {
      this.showCommet.push(commet);
      if (this.showCommet.length > 1) {
        this.showCommet.shift();
      }
    }
  }

  get leftCommet() {
    const right = this.commets.slice(this.currentCommetIndex);
    return right.concat(this.commets.slice(0, this.currentCommetIndex));
  }

  mounted () {
    setInterval(() => {
      if (this.current >= this.split - 1) {
        this.current = this.split - 1;
      } else {
        this.current++;
      }
    }, 3000);
  }
  created () {
    this.queryHighScoreApp(this.rn + 1);
    create().subscribe('/topic/appDevStatisc', res => {
      this.date = new Date();
      const schoolTotal = dataFormat(res.AppDevSchoolTotal)[0] || {};
      const app = dataFormat(res.AppDevAppStatisc)[0] || {};
      const increase = dataFormat(res.AppDevThisWeekNewAppNum)[0] || {};
      const categories = dataFormat(res.AppDevAppCategroyStatisc);
      const times = dataFormat(res.AppDevAppUseTimes);
      const schoolTop5 = dataFormat(res.AppDevSchoolTop5);
      const appTop5 = dataFormat(res.AppDevAppTop5);
      const access = dataFormat(res.AppDevTotalAccessStatisc)[0] || {};
      this.schoolTotal = schoolTotal.school_num || 0;
      this.appTotal = app.app_num || 0;
      this.pcAppTotal = app.pc_app_num || 0;
      this.mobileAppTotal = app.mobile_app_num || 0;
      this.appIncrease = increase.app_num || 0;
      this.appCategories = categories.map(data => {
        return {
          name: data.category_name + '  ' + data.app_num,
          value: data.app_num || 0
        }
      }).slice(0, 10);
      times.forEach(data => {
        if (data.user_type === '学生') {
          this.studentUseTimes = data.use_times || 0;
          this.studentSuggestTimes = data.suggest_times || 0;
        } else {
          this.teacherUseTimes = data.use_times || 0;
          this.teacherSuggestTimes = data.suggest_times || 0;
        }
      })
      this.schoolTop5 = schoolTop5.slice(0, 5);
      this.appTop5 = appTop5.slice(0, 5);

      this.studentAccessPVs = splitNumber(this.studentAccessPV, access.spv || 0, this.split);
      this.studentAccessUVs = splitNumber(this.studentAccessUV, access.suv || 0, this.split);
      this.teacherAccessPVs = splitNumber(this.teacherAccessPV, access.tpv || 0, this.split);
      this.teacherAccessUVs = splitNumber(this.teacherAccessUV, access.tuv || 0, this.split);
      this.current = 0;
    });
  }
}
