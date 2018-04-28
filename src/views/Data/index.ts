import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './data.html?style=./data.scss';
import Card from '@components/Card';
import MapChart from '@components/MapChart';
import PieChart from '@components/PieChart';
import BarChart from '@components/BarChart';
import LineChart from '@components/LineChart';
import ProgressBarGroup from '@components/ProgressBarGroup';
import create from '@utils/websocket';
import dataFormat from '@utils/dataFormat';
@WithRender
@Component({
  components: {Card, MapChart, PieChart, BarChart, LineChart, ProgressBarGroup}
})
export default class Data extends Vue {
  date = new Date();
  //应用访问排名
  codeValidate: ChartItem[] = [];
  busiValidate: ChartItem[] = [];
  coreBusiAccess: ChartItem[] = [];
  totalSpace = 0;
  totalNum = 0;
  last30Days1 = [];
  last30Days2 = [];
  last30DaysX = [];
  apiNum = 0;
  schoolNum = 0;
  sysNum = 0;
  factoryNum = 0;
  top5: ChartItem[] = [];

  created () {
    create().subscribe('/topic/dataConstructionStatisc/naju', res => {
      this.date = new Date();
      const code = dataFormat(res.dataConsCodeValidate)[0];
      this.codeValidate = [{
        name: '已对标',
        value: code.code_validated_num || 0
      }, {
        name: '未对标',
        value: code.code_invalidated_num || 0
      }]
      const busi = dataFormat(res.dataConsBusiValidate)[0];
      if (busi) {
        this.busiValidate = [{
          name: '有效',
          value: busi.busi_validated_num || 0
        }, {
          name: '无效',
          value: busi.busi_invalidated_num || 0
        }]
      }
      const core = dataFormat(res.dataConsCoreBusiAccess);
      this.coreBusiAccess = core.map(data => {
        return {
          value: data.access_num || 0,
          name: data.core_business
        }
      })
      const dataNum = dataFormat(res.dataConsDataNum)[0];

      if (dataNum) {
        this.totalSpace = dataNum.data_tomtal_space || 0;
        this.totalNum = dataNum.data_total_num || 0 ;
      }
      const l30d = dataFormat(res.dataConsLatest30Days);
      if (l30d && l30d.length > 0) {
        const last30Days1 = [];
        const last30Days2 = [];
        const last30DaysX = [];
        l30d.forEach(data => {
          last30DaysX.push(data.statisc_date);
          last30Days1.push(data.total_added);
          last30Days2.push(data.through_put);
        });
        this.last30DaysX = last30DaysX;
        this.last30Days1 = last30Days1;
        this.last30Days2 = last30Days2;
      }

      const schoolAndApi = dataFormat(res.dataConsSchoolAndApiNum)[0];
      if (schoolAndApi) {
        this.schoolNum = schoolAndApi.school_num || 0;
        this.apiNum = schoolAndApi.api_integration_num || 0;
      }

      const sysIntegration = dataFormat(res.dataConsSysIntegration)[0];
      if (sysIntegration) {
        this.sysNum = sysIntegration.system_integration_num || 0;
        this.factoryNum = sysIntegration.system_integration_factory_num || 0;
      }

      const top5 = dataFormat(res.dataConsApiFrequencyTop5);
      let max = 0;
      top5.forEach(data => data.invoke_times > max ? max = data.invoke_times : null);
      this.top5 = top5.map(data => {
        return {
          name: data.api_name,
          value: Math.round(data.invoke_times / max * 100),
          label: data.invoke_times
        }
      });
    })
  }
}
