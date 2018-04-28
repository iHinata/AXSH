import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import WithRender from './group.html?style=./group.scss';
import NumCard from '@components/NumCard';

@WithRender
@Component({
    components: { NumCard }
})
export default class NumCardGroup extends Vue {
    @Prop() num: number;
    @Prop({ default: 0 }) count: number;
    @Prop({ default: 'rgba(0, 0, 0, 0.4)' }) bgColor: string;

    get numsArr() {
        let nums = this.num;
        const arr = [];
        while (nums > 0) {
            arr.unshift(nums % 10);
            nums = parseInt(nums / 10 + '');
        }
        if (arr.length === 0) {
            arr.push(0);
        }
        if (this.count > 0 && this.count > arr.length) {
            for (let i = arr.length; i < this.count; i++) {
                arr.unshift(0);
            }
        }
        return arr;
    }

}
