import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './platform.html?style=./platform.scss';
import Card from '@components/Card';
import MapChart from '@components/MapChart';
import PieChart from '@components/PieChart';
import BarChart from '@components/BarChart';
import LineChart from '@components/LineChart';
import NestRingChart from '@components/NestRingChart';
import create from '@utils/websocket';
import dataFormat from '@utils/dataFormat';

@WithRender
@Component({
  components: {Card, MapChart, PieChart, BarChart, LineChart, NestRingChart}
})
export default class Platform extends Vue {
  area: ChartItem[] = [];
  schoolTypeCover: ChartItem[] = [];
  schoolType: ChartItem[] = [];
  schoolTypeX: string[] = [];
  increaseX: string[] = [];
  increase: ChartItem[] = [];
  acceptance: ChartItem[] = [];
  newRatio: ChartItem[] = [];
  date = new Date();
  created () {
    const legend = ['985/211', '普通本科', '高职', '中职'/* , '其他' */];
    // const legend = ['985/211', '本科', '中专', '高专', ''];
    const platformLegend = ['主数据管理平台'/* , '公共服务' *//* , '安心守护' */, '应用管理平台', '统一身份认证', '自助服务'];
    create().subscribe('/topic/mgtStatisc', res => {
      // console.log(res);
      this.date = new Date();
      const area = dataFormat(res.platformAreaStatisc);
      const schoolType = dataFormat(res.platformSchoolTypeStatics);
      const increase = dataFormat(res.platformSaleNumMonth);
      const acceptance = dataFormat(res.platformAcceptanceStatisc);
      const zsj = dataFormat(res.zsjPlatformVersionStatisc)[0] || {};
      const amp = dataFormat(res.ampPlatformVersionStatisc)[0] || {};
      const ids = dataFormat(res.idsPlatformVersionStatisc)[0] || {};
      this.area = area.map(data => {
        return {
          name: data.province || '',
          value: data.school_num || 0
        }
      })
      // const schoolTypeX = [];
      // for (let i=0; i<schoolType.length; i++) {
      //   if (schoolTypeX.indexOf(schoolType[i].platform) === -1) {
      //     schoolTypeX.push(schoolType[i].platform);
      //   }
      // }
      this.schoolTypeX = platformLegend;
      this.schoolTypeCover = legend.map(l => {
        let sum = 0;
        schoolType.forEach(data => {
          if (l === data.school_type) {
            sum += (data.school_num || 0);
          }
        })
        return {
          name: l,
          value: sum
        }
      });
      this.schoolType = legend.map(l => {
        const values = [];
        platformLegend.forEach(x => {
          const item = schoolType.find(data => data.school_type === l && data.platform === x)
          if (item) {
            values.push(item.school_num);
          } else {
            values.push(0);
          }
        })
        return {
          name: l,
          value: values
        }
      });
      const increaseX = [];
      for (let i = 0; i < increase.length; i++) {
        const x = increase[i];
        if (increaseX.indexOf(x.month) === -1) {
          increaseX.push(x.month);
        }
      }
      this.increaseX = increaseX.sort((a, b) => a < b ? -1 : 1);

      //  increase.forEach(data => {
      //   if (platformLegend.indexOf(data.platform) === -1) {
      //     platformLegend.push(data.platform);
      //   }
      // });
      this.increase = platformLegend.map(l => {
        const values = [];
        this.increaseX.forEach(x => {
          const item = increase.find(data => data.platform === l && data.month === x);
          if (item) {
            values.push(item.sale_num);
          } else {
            values.push(0);
          }
        });
        return {
          name: l,
          value: values
        }
      });
      this.acceptance = platformLegend.map(l => {
        const item = acceptance.find(data => data.platform === l);
        let value = 0;
        if (item) {
          value = Math.round(item.yshts / item.hts * 100);
        }
        return {
          name: l,
          value: value
        }
      });
      this.newRatio = platformLegend.map((l, idx) => {
        let platform = {latest_school_num: 0, school_num: 0};
        if (idx === 0) {
          platform = zsj;
        } else if (idx === 1) {
          platform = amp;
        } else if (idx === 2) {
          platform = ids;
        }
        const value = Math.round((platform.latest_school_num || 0) / (platform.school_num || 1) * 100);
        return {
          name: l,
          value: value
        }
      });
    });
  }
}
