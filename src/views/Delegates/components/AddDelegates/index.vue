<template>
  <div id="addModal">
    <div class="upper">
      <h2>Add New Delegate</h2>
      <a id='close' @click="exit()">
        <font-awesome-icon :icon="['fas', 'times']" size="lg" />
      </a>
    </div>
    <div class="mid">
      <div class="left">
        <div class="profile-pic" :class="{ noBG: getDelegatesID(newCountry.name) !== 'none'}">
          <span class="cam-logo">
            <font-awesome-icon :icon="['fas', 'camera']" size="lg" />
          </span>
          <span>Change Image</span>
          <input type="file" name="myImage" accept="image/*" class="inputimage"/>
          <transition name="fade">
            <span
              v-if="getDelegatesID(newCountry.name) !== 'none'"
              :class="`flag-icon img flag-icon-${getDelegatesID(newCountry.name).toLowerCase()}`"
            />
          </transition>
        </div>
      </div>
      <div class="right">
        <Autocomplete
          :class="{error: err}"
          :items="items"
          @onchangeCountry="onchangeCountry"
          @enter="addNewCountry()"
          class="country"/>
        <p class="err" v-if="err">{{ err }}</p>
        <div class="input">
          <input
            placeholder=" "
            v-model="newCountry.short"
            v-shortkey="{enter: ['enter']}"
            @shortkey.stop="addNewCountry"
          >
          <label>Short Name</label>
        </div>
      </div>
    </div>
    <button @click="addNewCountry()">Add</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import negara from '@/const/country.json';
import { addDelegates } from '@/api/delegates';
// eslint-disable-next-line no-unused-vars
import { delegatesType } from '@/types/api';
import Autocomplete from '@/components/Autocomplete/index.vue';

export default Vue.extend({
  name: 'AddDelegates',
  components: {
    Autocomplete,
  },
  props: {
    items: Array,
  },
  data() {
    return {
      imageDel: null as null,
      newCountry: {
        name: '' as string,
        short: '' as string,
      },
      err: '' as string,
    };
  },
  // computed: {
  //   defImg() {
  //     return require('../../../../assets/img/home.png');
  //   },
  // },
  methods: {
    getDelegatesID(name: string): string {
      const data = negara.find((obj) => obj.name === name);
      if (data) return data['alpha-2'];
      return 'none';
    },
    exit(): void {
      this.$emit('exit');
    },
    onchangeCountry(country): void {
      this.err = '';
      this.newCountry.name = country;
    },
    async addNewCountry(): Promise<void> {
      try {
        if (this.newCountry.name.length > 0) {
          const data: delegatesType.addDelegates[] = [{
            country: this.newCountry.name,
            status: 'N/A',
          }];
          await addDelegates(this.$route.params.id, data);
          this.$emit('update');

          this.newCountry = {
            name: '',
            short: '',
          };
          this.$emit('exit');
        }
      } catch (err) {
        this.err = err.response.data.error.message;
        console.error(err.response);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
