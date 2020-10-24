<template>
  <hooper class="slider">
    <slide class="card" v-for="(del, i) in $store.state.delegates" :key="i">
      <p class="desc">{{ countryDesc(del.id) }}</p>
      <div class="country">
        <img
          :src="`https://www.countryflags.io/${del.id}/flat/64.png`"
          :alt="country(del.id)"
          class="img"
        />
        <h1>{{ country(del.id) }}</h1>
      </div>
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
  },
  methods: {
    country(id) {
      const countryName = this.$store.state.delegates.find((obj) => obj.id === id);
      return countryName.short;
    },
    countryDesc(id) {
      const countryName = this.$store.state.delegates.find((obj) => obj.id === id);
      return countryName.presence === 'N/A' ? '' : countryName.presence;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
