import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import {Action, State} from 'vuex-class';
import WithRender from './running.html?style=./running.scss';
import Card from '@components/Card';
import MapChart from '@components/MapChart';
import NumCardGroup from '@components/NumCardGroup';
import Tab from '@components/Tab';
import ProgressBarGroup from '@components/ProgressBarGroup';
import PieChart from '@components/PieChart';
import {RUNNING_QUERY} from '@store/Constants';
import create from '@utils/websocket';
import dataFormat, {gradient} from '@utils/dataFormat';


const oneMinute = 1000 * 60;
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;

const colors = gradient('#031B10', '#00E308', 100);

@WithRender
@Component({
  components: {Card, MapChart, NumCardGroup, Tab, ProgressBarGroup, PieChart}
})
export default class Running extends Vue {
  @Action(RUNNING_QUERY) queryByAjax: Function;
  @State(state => state.running.startTime) startTime;
  @State(state => state.running.userCount) userCount;
  @State(state => state.running.axUserCount) axUserCount;
  @State(state => state.running.userCountThisWeekend) userCountThisWeekend;
  @State(state => state.running.appCount) appCount;
  @State(state => state.running.appCountThisWeek) appCountThisWeek;
  @State(state => state.running.hostCount) hostCount;
  @State(state => state.running.hostCountThisWeek) hostCountThisWeek;
  @State(state => state.running.dbCount) dbCount;
  @State(state => state.running.dbCountThisWeek) dbCountThisWeek;

  now: Date = new Date();
  date: Date = new Date();

  get runningTime() {
    const start = new Date(this.startTime);
    let left = this.now.getTime() - start.getTime();
    if (isNaN(left)) {
      return 0;
    }

    const days = Math.floor(left / oneDay);
    left = left - days * oneDay;
    const hours = this.now.getHours();
    const minutes = this.now.getMinutes();
    return {
      days,
      hours,
      minutes
    };
  }
  realtimeWarning: ChartItem[][] = [[], []];
  // monitor: ChartItem[] = [];
  monitorShow: ChartItem[] = [];
  monitorLimit = 6;
  health985 = [];
  healthPt = [];
  healthGz = [];
  healthZz = [];
  healthIndex = 0;
  eventWarning = [[], []];
  eventWarningAvailable: ChartItem[] = [];
  get health() {
    let h: ChartItem[] = null;
    if (this.healthIndex === 0) {
      h = this.health985;
    } else if (this.healthIndex === 1) {
      h = this.healthPt;
    } else if (this.healthIndex === 2) {
      h = this.healthGz;
    } else {
      h =this.healthZz
    }
    return h.map(data => {
      return {
        name: data.name,
        value: data.score
      }
    });
  }
  created () {
    setInterval(() => {
      this.now = new Date();
      this.healthIndex = (this.healthIndex + 1) % 4;
    }, 30000);
    setInterval(() => {
      if (this.monitorShow.length < 7) {
        return;
      }
      const showed = this.monitorShow.shift();
      this.monitorShow.push(showed);
      // if (this.monitor.length > 0) {
      //   const top = this.monitor.shift();
      //   if (this.monitorShow.length >= 7) {
      //     const showed = this.monitorShow.shift();
      //     this.monitor.push(showed);
      //   }
      //   this.monitorShow.push(top);
      // }
    }, 3000);
    this.queryByAjax();

    const labelStyle = {
      emphasis: {
        show: true,
        position: 'left',
        formatter: ({name, value}) => `{a|${name}}{abg|}\n{per|${value[2]}} 分 安全 {per|${value[4]}} 可用性 {per|${value[3]}}`,
        backgroundColor: 'rgba(16, 34, 189, 0.3)',
        borderRadius: 4,
        padding: [10, 20, 10, 20],
        rich: {
          a: {
            color: '#fff',
            lineHeight: 32,
            fontSize:18,
            align: 'center'
          },
          b: {
            backgroundColor: '#334455',
            color: '#eee',
            fontSize: 18,
            lineHeight: 32
          },
          per: {
              color: '#eee',
              backgroundColor: '#334455',
              padding: [2, 4],
              borderRadius: 2
          }
        }
      }
    };
    create().subscribe('/topic/axshRunState', res => {
      this.date = new Date();
      // const monitors = dataFormat(res.realTimeMonitor);
      // if (this.monitorShow.length === 0) {
      //   this.monitorShow = monitors.splice(0, 6);
      // }
      // this.monitor.push.apply(this.monitor, monitors.slice(0))
      this.monitorShow = dataFormat(res.realTimeMonitor);
      if (res.schoolHealtyStatus) {
        this.health985 = dataFormat(res.schoolHealtyStatus.schoolHealtyStatus985211);
        this.healthPt = dataFormat(res.schoolHealtyStatus.schoolHealtyStatusPtbk);
        this.healthGz = dataFormat(res.schoolHealtyStatus.schoolHealtyStatusGz);
        this.healthZz = dataFormat(res.schoolHealtyStatus.schoolHealtyStatusZz);
      }
      if (res.eventWarning) {
        const total = dataFormat(res.eventWarning.total)[0] || {};
        const today = dataFormat(res.eventWarning.today)[0] || {};
        this.eventWarning = [
          [{
            name: '已解决',
            value: total.recoveried_count || 0
          }, {
            name: '未解决',
            value: total.unrecoveried_count || 0
          }],
          [{
            name: '已解决',
            value: today.recoveried_count || 0
          }, {
            name: '未解决',
            value: today.unrecoveried_count || 0
          }]
        ]
      }
      const realtimeWarning = dataFormat(res.realTimeWarning);
      const realtimeWarningAva = [];
      const realtimeWarningSafe = [];
      realtimeWarning.forEach(data => {
        let color = colors[(data.total_score-1) % 100];
        if (Math.abs(data.available_score) > 0) {
          color = 'rgba(226, 255, 0, 0.6)';
        }
        if (Math.abs(data.safety_score) > 0) {
          color = 'rgba(255, 11, 41, 0.4)';
        }
        realtimeWarningAva.push({
          name: data.school_name,
          value: [
            data.longitude,
            data.latitude,
            data.total_score,
            data.available_score,
            data.safety_score
          ],
          label: labelStyle,
          itemStyle: {
            normal: {
              color: color
            }
          }
        });
      });
      this.eventWarningAvailable = realtimeWarningAva;
    });
  }
}
