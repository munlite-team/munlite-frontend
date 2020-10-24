<template>
  <div id='rollcall'>
    <a @click="$parent.$emit('no-modal-warn')" id='close' title="Close">
      <font-awesome-icon :icon="['fas', 'times']" size="lg" />
    </a>
    <h2>Roll Call</h2>
    <h3>Countries</h3>
    <div id='call'>
      <Slider :active="voteCount" prgrs="presence"/>
      <!-- <CardStack :active="voteCount" prgrs="presence" desc="presence" /> -->
      <div id='selection'>
        <!-- <button @click="un()"
        :disabled="voteCount === 0"
        title="Undo"
        class="red" id="undo">
          <font-awesome-icon :icon="['fas', 'undo']" size="lg" />
        </button> -->
        <button @click="presence('Present')">
          Present
        </button>
        <button @click="presence('Present & Voting')">
          Present &amp; Voting
        </button>
        <button @click="presence('Not Present')" class="red">
          Not Present
        </button>
      </div>
      <button @click="$parent.$emit('stage', 2)"
        :disabled="voteCount !== $store.state.delegates.length"
        id="continue"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import Slider from '@/components/Slider/index.vue';

export default {
  components: {
    Slider,
  },
  data() {
    return {
      voteCount: 0,
    };
  },
  methods: {
    presence(j) {
      const i = this.voteCount;
      this.$store.commit('presence', { i, j });
      this.voteCount += 1;
      if (j === 'Present') {
        this.$store.commit('present');
      } else if (j === 'Present & Voting') {
        this.$store.commit('presentVoting');
      }
    },
    un() {
      this.voteCount -= 1;
      this.$store.commit('undo');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss'
</style>
