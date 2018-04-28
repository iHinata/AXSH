import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './home.html?style=./home.scss';
import create from '@utils/websocket';
import dataFormat from '@utils/dataFormat';

@WithRender
@Component
export default class Home extends Vue {
  schoolTotal = 0;
  newSchoolTotal = 0;
  studentUseNum = 0;
  teacherUseNum = 0;
  useTotal = 0;
  todayActive = 0;
  todayActiveStudent = 0;
  todayActiveTeacher = 0;
  appInNum = 0;
  appOutNum = 0;
  appTotal = 0;
  appIncreaseNum = 0;
  outDevNum = 0;
  outDevIncreaseNum = 0;
  created () {
    create().subscribe('/topic/summaryStatisc', res => {
      const schoolTotal = dataFormat(res.SummarySchoolTotal)[0] || {};
      const newSchoolTotal = dataFormat(res.SummaryNewSchoolNum)[0] || {};
      const userNums = dataFormat(res.SummaryUserNum);
      const todayActive = dataFormat(res.SummaryTodayActiveUserNum);
      const appTotal = dataFormat(res.SummaryAppTotal)[0] || {};
      const appIncreaseNum = dataFormat(res.SummaryThisWeekNewAppNum)[0] || {};
      const outDev = dataFormat(res.SummaryOutDevNum)[0] || {};
      const outNewDev = dataFormat(res.SummaryThisWeekNewOutDevNum)[0] || {};
      this.schoolTotal = schoolTotal.school_num || 0;
      this.newSchoolTotal = newSchoolTotal.new_school_num || 0;
      let sum = 0;
      userNums.forEach(data => {
        sum += data.user_num;
        if (data.role === '学生') {
          this.studentUseNum = data.user_num;
        } else if (data.role === '教师') {
          this.teacherUseNum = data.user_num;
        }
      });
      this.useTotal = sum;
      let todaySum = 0;
      todayActive.forEach(data => {
        todaySum += data.user_num;
        if (data.role === '学生') {
          this.todayActiveStudent = data.user_num;
        } else if (data.role === '教师') {
          this.todayActiveTeacher = data.user_num;
        }
      });
      this.todayActive = todaySum;
      this.appTotal = appTotal.app_num;
      this.appOutNum = appTotal.out_app_num;
      this.appInNum = appTotal.in_app_num;
      this.appIncreaseNum = appIncreaseNum.new_app_num || 0;
      this.outDevNum = outDev.out_dev_num || 0;
      this.outDevIncreaseNum = outNewDev.new_dev_num || 0;
    });
  }
}
