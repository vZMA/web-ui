<template>
  <div>
    <div class="card">
      <div class="card-content">
        <span class="card-title"> Who's Online? </span>
      </div>
      <div class="card-tabs">
        <ul class="tabs tabs-fixed-width">
          <li class="tab"><a href="#atc_online">Controllers</a></li>
          <li class="tab"><a href="#pilots_online">Departures/Arrivals</a></li>
        </ul>
      </div>
      <div id="atc_online">
        <div v-if="!atcOnline" class="loading_container">
          <Spinner />
        </div>
        <div v-else-if="atcOnline && atcOnline.length > 0">
          <AtcOnlineItem
            v-for="(atc, k) in atcOnline"
            :key="k"
            :controller="atc"
          />
        </div>
        <div v-else>
          <p>There are no controllers online right now</p>
        </div>
      </div>
      <div id="pilots_online">
        <div v-if="!pilotsOnline" class="loading_container">
          <Spinner />
        </div>
        <div v-else-if="pilotsOnline && pilotsOnline.length > 0">
          <PilotOnlineItem
            v-for="(pilot, k) in depsArrs"
            :key="k"
            :pilot="pilot"
          />
        </div>
        <div v-else>
          <p>There are no departures/arrivals online right now</p>
        </div>
      </div>
      <p class="as_of">As of {{ getZuluTime() }}z</p>
    </div>

    <div class="card" v-if="user.isLoggedIn">
      <div class="card-content">
        <span class="card-title">
          {{
            new Date().toLocaleString("en-US", {
              month: "long",
              timeZone: "UTC",
            })
          }}
          Leaderboard
        </span>
      </div>
      <div class="card-tabs">
        <ul class="tabs tabs-fixed-width">
          <li class="tab"><a href="#top_controllers">Controllers</a></li>
          <li class="tab"><a href="#top_positions">Positions</a></li>
        </ul>
      </div>
      <div id="top_controllers">
        <div v-if="!top" class="loading_container">
          <Spinner />
        </div>
        <div v-else-if="top.controllers && top.controllers.length > 0">
          <router-link
            class="top"
            :to="`/controllers/${item.cid}`"
            v-for="item in top.controllers"
            :key="item.cid"
          >
            <span
              ><strong>{{ item.name }}</strong></span
            >
            <span>{{ secondsToHms(item.len) }}</span>
          </router-link>
        </div>
        <div v-else>
          <p>There is no one on the leaderboard yet. Go control already!</p>
        </div>
      </div>
      <div id="top_positions">
        <div v-if="!top" class="loading_container">
          <Spinner />
        </div>
        <div v-else-if="top.positions && top.positions.length > 0">
          <span class="top" v-for="item in top.positions" :key="item.cid">
            <span
              ><strong>{{ item.name }}</strong></span
            >
            <span>{{ secondsToHms(item.len) }}</span>
          </span>
        </div>
        <div v-else>
          <p>There is no one on the leaderboard yet. Go control already!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AtcOnlineItem from "./AtcOnlineItem.vue";
import PilotOnlineItem from "./PilotOnlineItem.vue";
import { zabApi } from "@/helpers/axios.js";
import { mapState } from "vuex";

export default {
  components: {
    AtcOnlineItem,
    PilotOnlineItem,
  },
  data() {
    return {
      pilotsOnline: null,
      updateTime: "",
      atcOnline: null,
      ratings: null,
      airports: ["X06","07FA","06FA","KAVO","KAGR","KBOW","X10","KBCT","KBKV","X05","KCLW","2IS","X36","X01","KFLL","FXE","KFMY","KRSW","KFPR","KHWO","KHST","X51","KIMM","KEYW","KNQX","X14","X49","KLAL","X07","X25","KMTH","KMKY","KTMB","KTNT","KMIA","KOPF","KAPF","KOBE","KPHK","KPCM","KPMP","KSPG","KPIE","KSRQ","X26","KSEF","KSUA","KTPA","KVDF","KMCF","X39","KTPF","KVNC","X52","KVRB","KCHN","F45","KPBI","KLNA","KGIF","KZPH"],
      top: null,
    };
  },
  async mounted() {
    M.Tabs.init(document.querySelectorAll(".tabs"));
    await this.getOnline();
    setInterval(() => {
      this.getOnline();
    }, 15000);
  },
  methods: {
    async getOnline() {
      const { data } = await zabApi.get("/online");
      this.pilotsOnline = data.data.pilots;
      this.atcOnline = data.data.atc;
      const { data: topData } = await zabApi.get("/online/top");
      this.top = topData.data;
      this.getZuluTime(); // update time when refreshing who's online
    },
    getZuluTime() {
      return new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      });
    },
    sec2hms(secs) {
      if (!secs) return null;
      const hours = Math.floor(secs / 3600);
      const minutes = `0${Math.floor((secs % 3600) / 60)}`.slice(-2);
      const seconds = `0${secs % 60}`.slice(-2);
      return `${hours}:${minutes}:${seconds}`;
    },
    secondsToHms(secs) {
      const days = Math.floor(secs / 86400);
      const remainderSeconds = secs % 86400;
      const hms = new Date(remainderSeconds * 1000)
        .toISOString()
        .substring(11, 19);
      return hms.replace(/^(\d+)/, (h) => `${+h + days * 24}`.padStart(2, "0"));
    },
  },
  computed: {
    ...mapState("user", ["user"]),
    depsArrs() {
      return this.pilotsOnline.filter((flight) => {
        return (
          this.airports.includes(flight.dep) ||
          this.airports.includes(flight.dest)
        );
      });
    },
  },
};
</script>

<style scoped lang="scss">
.tabs-fixed-width {
  overflow: hidden;

  .tab {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

#atc_online,
#pilots_online,
#top_controllers,
#top_positions {
  p {
    padding: 15px 10px;
    margin: 0;
    font-style: italic;
  }
}

#atc_online,
#pilots_online {
  p {
    padding: 15px 10px 5px 10px;
  }
}

.as_of {
  padding: 10px;
  margin-top: 0;
  font-size: 12px;
  color: $secondary-color-dark;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  position: relative;
  transition: background-color 0.3s ease;

  &:nth-of-type(2n-1) {
    background: $gray-mild;
  }

  &:hover {
    background: #eaeaea;
  }
}

#discord_widget {
  min-height: 500px;
}
</style>
