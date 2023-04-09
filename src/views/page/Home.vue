<template>
  <div>
    <div class="card home_intro">
      <div class="card-content">
        <span class="card-title">Welcome to Miami ARTCC</span>
        <p>
          Hello, and welcome to the Miami ARTCC. We are a group of aviation
          enthusiasts providing simulated ATC services, operating on the VATSIM
          network, the Americas region and the VATUSA division. The Miami ARTCC
          covers most of south Florida, but not Orlando.
        </p>
        <div v-if="shouldShowPopup" class="popup">
          <p>Please switch to Safari to get the best experience.</p>
        </div>
        <div
          class="visit"
          v-if="!user.isLoggedIn || (!user.data.vis && !user.data.isMem)"
        >
          <p>
            If you would like to become a visitor, please click the button
            below.
          </p>
          <router-link to="/controllers/visit" class="btn btn-waves"
            >Become a Visitor</router-link
          >
        </div>
      </div>
    </div>
    <EventSummary />
    <NewsSummary />
    <WeatherInfo />
  </div>
</template>

<script>
import { mapState } from "vuex";
import WeatherInfo from "../partial/WeatherInfo.vue";
import NewsSummary from "../partial/NewsSummary.vue";
import EventSummary from '../partial/EventSummary.vue';

export default {
  title: "Home",
  components: {
    NewsSummary,
    WeatherInfo,
    EventSummary
  },
  computed: {
    ...mapState("user", ["user"]),
  },
  data() {
    return {
      shouldshowPopup: false,
    }
  },

  mounted() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIphone = /iphone/.test(userAgent);
    const isChrome = /chrome/.test(userAgent);
    if (isIphone && isChrome) {
      this.shouldShowPopup = true;
    }
  }
};
</script>

<style scoped lang="scss">
.visit {
  margin-top: 1em;
  text-align: center;

  p {
    text-align: left;
  }

  .btn {
    margin-top: 1em;
  }
}
</style>
