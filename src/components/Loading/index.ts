import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import WithRender from './loading.html?style=./loading.scss';

@WithRender
@Component
export default class Loading extends Vue {
  @Prop({default: false}) load: boolean;
}
