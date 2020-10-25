<template>
  <hooper id="sliderCard" @slide="move" ref="carousel">
    <slide
      class="card"
      v-for="(del, i) in $store.state.delegates"
      :key="i"
      :class="{white : del.presence !== 'N/A'}"
    >
      <p class="desc">{{ countryDesc(del.presence) }}</p>
      <div class="country">
        <img
          :src="`https://www.countryflags.io/${del.id}/flat/64.png`"
          :alt="del.short"
          class="img"
        />
        <h1>{{ del.short }}</h1>
      </div>
      <div class="progress" :class="color(del.id, i)"></div>
    </slide>

    <hooper-navigation slot="hooper-addons"></hooper-navigation>
    <hooper-pagination slot="hooper-addons" mode="fraction"></hooper-pagination>
  </hooper>
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
    current: Number,
  },
  methods: {
    move(payload) {
      this.$emit('move', payload.currentSlide);
    },
    countryDesc(presence) {
      return presence === 'N/A' ? '' : presence;
    },
    color(id) {
      const status = this.$store.state.delegates.find((obj) => obj.id === id);
      if (status.presence === 'Present' || status.presence === 'Present & Voting') {
        return 'blue';
      }

      if (status.presence === 'Not Present') {
        return 'red';
      }

      return '';
    },
    nextSlide() {
      setTimeout(() => { this.$refs.carousel.slideNext(); }, 700);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
