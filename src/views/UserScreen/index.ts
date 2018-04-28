import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './list.html?style=./list.scss';

@WithRender
@Component
export default class UserScreen extends Vue {
  @Prop() schoolCode;
  @Prop() token;
  baseURL = 'http://axsh.campusphere.cn/screen_new/';
  url1 = `${this.baseURL}/#/CoreApp?schoolCode=${this.schoolCode}&token=${this.token}`;
  url2 = `${this.baseURL}/#/SecureDefend?schoolCode=${this.schoolCode}&token=${this.token}`;
  url3 = `${this.baseURL}/#/HostStatus?schoolCode=${this.schoolCode}&token=${this.token}`;
  url4 = `${this.baseURL}/#/AppAnalysis?schoolCode=${this.schoolCode}&token=${this.token}`;
  url5 = `${this.baseURL}/#/UserAction?schoolCode=${this.schoolCode}&token=${this.token}`;
  url6 = `${this.baseURL}/#/DataAnalysis?schoolCode=${this.schoolCode}&token=${this.token}`;
}
