<template>
  <div id="rollcall">
      <a @click="$parent.$emit('stage', 0)" id="close">
        <font-awesome-icon :icon="['fas', 'times']" size="lg" />
      </a>
      <h2>Roll Call</h2>
      <h3>Voting</h3>
      <p v-if="width < 600">Swipe to view more</p>
      <div class="info" v-if="width > 600">
        <PresenceInfo :info="info"/>
        <div class="line" />
        <OtherInfo :rulesData="rulesData"/>
      </div>
      <div class="info" v-else>
        <PresenceInfo class="swipe active" v-touch:swipe="swipeHandler" :info="info"/>
        <OtherInfo class="swipe" v-touch:swipe="swipeHandler" :rulesData="rulesData"/>
      </div>
      <p>Votes to open the debate</p>
      <div id="select">
        <div class="selection">
          <input class="input blue" type="number" min="0"
          :max="this.info['Total Present'] - this.no"
          v-model.number="yes">
          <h2 class="blue">Yes</h2>
        </div>
        <div class="selection">
          <input class="input red" type="number" min="0"
          :max="this.info['Total Present'] - this.yes"
          v-model.number="no">
          <h2 class="red">No</h2>
        </div>
        <div id="indicator" ref="indicator" />
      </div>
      <div id="verdict">
      <p v-if="left">{{ left }} countries left</p>
      <p v-else-if="!left">no countries left</p>
    <button id="rerun"
    :disabled="this.left !== 0"
    v-if="vote"
    @click="$parent.$emit('stage', 1);">
      Re-run
    </button>
    <button :disabled="this.left !== 0"
    v-else
    @click="$parent.$emit('stage', 3);">
      Pass
    </button>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { gsap } from 'gsap';
import { mapState } from 'vuex';
import PresenceInfo from './components/PresenceInfo.vue';
import OtherInfo from './components/OtherInfo.vue';

export default Vue.extend({
  components: {
    PresenceInfo,
    OtherInfo,
  },
  data() {
    return {
      yes: 0 as number,
      no: 0 as number,
    };
  },
  props: {
    delegatesData: Array,
    info: Object,
    rulesData: Object,
  },
  computed: {
    ...mapState({
      width: (state: any) => state.Global.widthWindow,
    }),
    vote(): boolean {
      if (this.no > this.yes) {
        return true;
      }
      return false;
    },
    left(): number {
      return this.info['Total Present'] - (this.yes + this.no);
    },
  },
  methods: {
    swipeHandler(direction: string): void {
      const swipe: HTMLElement | null = document.querySelector('.swipe:first-child');
      const swipe2: HTMLElement | null = document.querySelector('.swipe:last-child');
      if (direction === 'left') {
        if (swipe2 && swipe2.classList.contains('active')) {
          gsap.set(swipe, {
            x: '100%',
          });
        } else {
          gsap.set(swipe2, {
            x: '0',
          });
        }
        gsap.to('.swipe', {
          x: '-=100%',
        });
      } else if (direction === 'right') {
        if (swipe2 && swipe2.classList.contains('active')) {
          gsap.set(swipe, {
            x: '-100%',
          });
        } else {
          gsap.set(swipe2, {
            x: '-200%',
          });
        }
        gsap.to('.swipe', {
          x: '+=100%',
        });
      }
      if (swipe) swipe.classList.toggle('active');
      if (swipe2) swipe2.classList.toggle('active');
    },
  },
  watch: {
    left() {
      if (this.vote && this.no !== this.yes) {
        (this.$refs.indicator as HTMLElement).style.cssText = 'opacity: 1; left: 55%; background-color: rgba(255,95,95,0.2);';
      } else if (!this.vote && this.no !== this.yes) {
        (this.$refs.indicator as HTMLElement).style.cssText = 'opacity: 1; left: 5%; background-color: rgba(95,120,255,0.2);';
      } else if (this.no === this.yes) {
        (this.$refs.indicator as HTMLElement).style.cssText = 'opacity: 0; left: 30%; background-color: rgba(255,255,255,0.2);';
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
