import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './navi.html?style=./navi.scss';

@WithRender
@Component
export default class Navi extends Vue {
  @Prop() data: Menu[];
}
