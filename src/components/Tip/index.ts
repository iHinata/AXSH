import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import WithRender from './tip.html?style=./tip.scss';

@WithRender
@Component
export default class Tip extends Vue {
}
