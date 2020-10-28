<template>
  <div class="delegates">
    <div class="delegates-upper">
      <h1 class="title">Delegates</h1>
      <div class="delegates-button">
        <button class="button" @click="showModal">Roll Call</button>
        <div class="button">
          <input
            v-model="newCountry"
            type="text"
            placeholder="add country..."
            :class="{show: showInput == true}"
          />
          <font-awesome-icon :icon="['fas', 'plus']" @click="toggleInput"/>
        </div>
      </div>
    </div>
    <div class="delegates-table">
      <div class="table">
        <div class="title">
          <p class="title-name">Name</p>
          <p class="title-presence">Presence</p>
        </div>
        <div class="content">
          <div class="table-data" v-if="delegatesData.length > 0">
            <div v-for="(data, index) in delegatesData" :key="index" class="data">
              <p class="name" @mouseover="hoverable = index" @mouseleave="hoverable = null">
                <img :src="`https://www.countryflags.io/${getDelegatesID(data.country)}/flat/64.png`" :alt="data.name" class="img"/>
                {{ data.country }}
                <span :class="{show: hoverable == index}">
                  <font-awesome-icon :icon="['fas', 'trash-alt']" />
                </span>
              </p>
              <p class="presence">{{ data.status }}</p>
            </div>
          </div>
          <div class="table-data empty-data" v-else>No Delegates in the list</div>
          <div class="info">
            <div class="info-data" v-for="(value, key) in info" :key="key">
              <p class="title emphasize">{{ key }}</p>
              <p class="data"><b class="emphasize">{{ value }}</b> Delegates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="rollcall" v-if="showOverlay">
        <transition name="fade">
          <Warning :key="0" v-if='warning'
          title="Are You Sure?"
          desc="This will discard all current roll call &amp; voting progress." />
        </transition>
        <div class="overlay" v-if="warning" />
        <RollCall
          :key="1"
          :delegatesData="delegatesData"
          @update="updateDelegatesData"
          v-if="stage === 1"
        />
        <Vote
          :key="2" v-else-if="stage === 2"
          :delegatesData="delegatesData"
          :info="info"
          :rulesData="rulesData"
        />
        <Pass :key="3" v-else-if='stage === 3' />
      </div>
    </transition>
    <div class="overlay" v-if="showOverlay" />
  </div>
</template>

<script>
import { getAllDelegates } from '@/api/delegates';
import { getConference } from '@/api/conference';
import { countryDetails } from '@/const/country';
import Warning from '@/components/Warning/index.vue';
import RollCall from './components/RollCall/index.vue';
import Vote from './components/Vote/index.vue';
import Pass from './components/Pass/index.vue';

export default {
  name: 'Delegates',
  components: {
    RollCall,
    Warning,
    Vote,
    Pass,
  },
  data() {
    return {
      showOverlay: false,
      hoverable: null,
      showInput: false,
      newCountry: '',
      warning: false,
      stage: 0,
      delegatesData: [],
      dr_vote: 0,
      rulesData: [],
    };
  },
  computed: {
    info() {
      const present = this.delegatesData.filter((obj) => obj.status === 'Present');
      const pv = this.delegatesData.filter((obj) => obj.status === 'Present & Voting');
      const total = present.length + pv.length;
      const data = {
        Present: present.length,
        'Present & Voting': pv.length,
        'Total Present': total,
        'DR Sponsors': Math.floor(this.dr_vote * (total)),
      };
      return data;
    },
  },
  methods: {
    showModal() {
      this.showOverlay = true;
      this.stage = 1;
    },
    toggleInput() {
      this.showInput = !this.showInput;
      this.newCountry = '';
    },
    getDelegatesID(name) {
      const data = countryDetails.filter((obj) => obj.name === name);
      return data[0].id;
    },
    sortCountry(items) {
      items.sort((a, b) => {
        const nameA = a.country.toUpperCase();
        const nameB = b.country.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // equal
        return 0;
      });
      return items;
    },
    async updateDelegatesData() {
      try {
        const delegates = await getAllDelegates('5f96e22bdb7ee38458e581e9');
        if (delegates.data.data !== null) {
          this.delegatesData = this.sortCountry(delegates.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
  watch: {
    stage() {
      if (this.stage > 0) {
        document.querySelector('body').style.cssText = 'height: 100vh; width: 100vw; overflow: hidden;';
      } else if (this.stage === 0) {
        document.querySelector('body').removeAttributes('height', 'width', 'overflow');
      }
    },
    warning() {
      if (this.warning === 'discard') {
        this.stage = 0;
        this.showOverlay = false;
        this.warning = false;
      }
    },
  },
  async created() {
    this.updateDelegatesData();
    try {
      const conference = await getConference('5f96e22bdb7ee38458e581e9');
      this.rulesData = conference.data.data.rules;
      const [parse] = (conference.data.data.rules.dr_vote).split(' ');
      const num = parse.split('/');
      this.dr_vote = (num[0] / num[1]).toFixed(2);
    } catch (err) {
      console.error(err);
    }
  },
  mounted() {
    this.$on('stage', (i) => {
      if (i === 0) {
        this.showOverlay = false;
      }
      this.stage = i;
    });
    this.$on('no-modal-warn', () => {
      this.warning = true;
    });
    this.$on('confirm', (i) => {
      this.warning = i;
    });
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
