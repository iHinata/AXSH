import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import WithRender from './input.html?style=./input.scss';

@WithRender
@Component
export default class SearchInput extends Vue {
  @Prop() placeholder: string;
  key = '';
  search(event) {
    if (event) {
      event.preventDefault();
    }
    this.$emit('search', this.key);
  }
}
