<template>
  <div>
    <hooper id="slider" @slide="move" :progress="true">
      <slide
        class="card"
        v-for="(del, i) in $store.state.delegates"
        :key="i"
      >
        <p class="desc">{{ countryDesc(del.id) }}</p>
        <div class="country">
          <img
            :src="`https://www.countryflags.io/${del.id}/flat/64.png`"
            :alt="country(del.id)"
            class="img"
          />
          <h1>{{ country(del.id) }}</h1>
        </div>
        <div class="progress" :class="color(del.id, i)"></div>
      </slide>

      <hooper-navigation slot="hooper-addons"></hooper-navigation>
      <hooper-pagination slot="hooper-addons" mode="fraction"></hooper-pagination>
    </hooper>
  </div>
</template>

<script>
import {
  Hooper,
  Slide,
  Pagination as HooperPagination,
  Navigation as HooperNavigation,
} from 'hooper';
import 'hooper/dist/hooper.css';

export default {
  components: {
    Hooper,
    Slide,
    HooperPagination,
    HooperNavigation,
  },
  props: {
    active: {
      type: Number,
      required: true,
    },
    current: String,
  },
  methods: {
    move(payload) {
      this.$emit('move', payload.currentSlide);
    },
    country(id) {
      const countryName = this.$store.state.delegates.find((obj) => obj.id === id);
      return countryName.short;
    },
    countryDesc(id) {
      const countryName = this.$store.state.delegates.find((obj) => obj.id === id);
      return countryName.presence === 'N/A' ? '' : countryName.presence;
    },
    color(id, i) {
      const status = this.$store.state.delegates.find((obj) => obj.id === id);
      const slider = document.getElementById('slider');
      if (status.presence === 'Present' || status.presence === 'Present & Voting') {
        if (this.current === i) {
          slider.style.color = 'white';
        }
        return 'blue';
      }

      if (status.presence === 'Not Present') {
        if (this.current === i) {
          slider.style.color = 'white';
        }
        return 'red';
      }

      if (slider && status.presence === 'N/A' && this.current === i) {
        slider.style.color = 'black';
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
