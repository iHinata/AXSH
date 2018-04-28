import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import {Action, State} from 'vuex-class';
import WithRender from './login.html?style=./login.scss';
import {LOGIN} from '@store/Constants';
import Tip from '@components/Tip';

@WithRender
@Component({
  components: {Tip}
})
export default class Login extends Vue {
  name = '';
  password = '';

  @Action(LOGIN) login;
  @State(state => state.login.msg) message: string;
  @State(state => state.login.show) show: boolean;

  submit(event) {
    if (event) {
      event.preventDefault();
    }
    this.login({
      userName: this.name,
      pwd: this.password
    }).then(() => {
      if (this.message === '') {
        sessionStorage.setItem('user', this.name);
        this.$router.replace({name: 'list'});
      }
    });
  }
  reset() {
    this.name = '';
    this.password = '';
    if (this.$refs.name.focus) {
      this.$refs.name.focus();
    }
  }
}
