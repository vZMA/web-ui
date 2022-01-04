<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">Current Weather</span>
      <p>
        The runways listed here are suggestions. If there is a controller
        online, they may be using different runways than those listed here.
        Please always check with the controller's ATIS prior to planning your
        runways.
      </p>
    </div>
    <div
      class="table_overflow_wrapper"
      v-if="numStationsLoaded === Object.keys(stations).length"
    >
      <table class="striped compact">
        <thead>
          <tr>
            <th>Airport</th>
            <th>Wind</th>
            <th>Conditions</th>
            <th>Landing</th>
            <th>Departing</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="station in stations" :key="station.icao">
            <td>
              <span class="hide-on-med-and-down"
                >{{ station.fullName }}
                <strong>({{ station.icao }})</strong></span
              ><span class="hide-on-large-only">{{ station.icao }}</span>
            </td>
            <td>{{ formatWind(station) }}</td>
            <td>
              <div
                class="airport_conditions"
                v-html="getConditions(station)"
              ></div>
            </td>
            <td>{{ station.getLanding() }}</td>
            <td>{{ station.getDeparting() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-content loading" v-else>
      <Spinner />
    </div>
  </div>
</template>

<script>
import { zabApi } from "@/helpers/axios.js";
import parse from "metar-parser";

export default {
  data() {
    return {
      icao: ["KMIA", "KFLL", "KTPA", "KRSW", "KPBI", "KEYW"],
      stations: {
        KMIA: {
          icao: "KMIA",
          fullName: "Miami International Airport",
          metar: null,
          parsedMetar: null,
          configs: {
            landing: {
              WD: "26R/30/26L/27",
              ED: "9/12/8L/8R",
              WN: "26L",
              EN: "8R/9",
            },
            departing: {
              WD: "26L/27/26R/30",
              ED: "8R/8L/9/12",
              WN: "26L/ 27",
              EN: "8R/9",
            },
          },
          getLanding: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              if (
                this.parsedMetar.time.hour >= 6 &&
                this.parsedMetar.time.hour <= 23
              ) {
                return this.configs.landing.ED;
              } else {
                return this.configs.landing.EN;
              }
            } else {
              if (
                this.parsedMetar.wind.direction > 180 &&
                this.parsedMetar.wind.direction <= 359
              ) {
                //west ops
                if (
                  this.parsedMetar.time.hour >= 6 &&
                  this.parsedMetar.time.hour <= 23
                ) {
                  return this.configs.landing.WD;
                } else {
                  return this.configs.landing.WN;
                }
              } else {
                if (
                  this.parsedMetar.time.hour >= 6 &&
                  this.parsedMetar.time.hour <= 23
                ) {
                  return this.configs.landing.ED;
                } else {
                  return this.configs.landing.EN;
                }
              }
            }
          },
          getDeparting: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              if (
                this.parsedMetar.time.hour >= 6 &&
                this.parsedMetar.time.hour <= 23
              ) {
                return this.configs.departing.ED;
              } else {
                return this.configs.departing.EN;
              }
            } else {
              if (
                this.parsedMetar.wind.direction > 180 &&
                this.parsedMetar.wind.direction <= 359
              ) {
                //west ops
                if (
                  this.parsedMetar.time.hour >= 6 &&
                  this.parsedMetar.time.hour <= 23
                ) {
                  return this.configs.departing.WD;
                } else {
                  return this.configs.departing.WN;
                }
              } else {
                if (
                  this.parsedMetar.time.hour >= 6 &&
                  this.parsedMetar.time.hour <= 23
                ) {
                  return this.configs.departing.ED;
                } else {
                  return this.configs.departing.EN;
                }
              }
            }
          },
        },
        KFLL: {
          icao: "KFLL",
          fullName: "Ft Lauderdale Hollywood International Airport",
          metar: null,
          parsedMetar: null,
          configs: {
            landing: {
              E: "10L/10R",
              W: "28L/28R",
            },
            departing: {
              E: "10L/10R",
              W: "28L/28R",
            },
          },
          getLanding: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              return this.configs.landing.E;
            } else {
              if (
                this.parsedMetar.wind.direction > 180 &&
                this.parsedMetar.wind.direction <= 359
              ) {
                return this.configs.landing.W;
              } else {
                return this.configs.landing.E;
              }
            }
          },
          getDeparting: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              return this.configs.departing.E;
            } else {
              if (
                this.parsedMetar.wind.direction > 180 &&
                this.parsedMetar.wind.direction <= 359
              ) {
                return this.configs.departing.W;
              } else {
                return this.configs.departing.E;
              }
            }
          },
        },
        KTPA: {
          icao: "KTPA",
          fullName: "Tampa International Airport",
          metar: null,
          parsedMetar: null,
          configs: {
            landing: {
              N: "1L/1R",
              S: "19L/19R",
            },
            departing: {
              N: "1L/1R",
              S: "19L/19R",
            },
          },
          getLanding: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              return this.configs.landing.N;
            } else {
              if (
                this.parsedMetar.wind.direction > 90 &&
                this.parsedMetar.wind.direction <= 270
              ) {
                return this.configs.landing.S;
              } else {
                return this.configs.landing.N;
              }
            }
          },
          getDeparting: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              return this.configs.departing.N;
            } else {
              if (
                this.parsedMetar.wind.direction > 90 &&
                this.parsedMetar.wind.direction <= 270
              ) {
                return this.configs.departing.S;
              } else {
                return this.configs.departing.N;
              }
            }
          },
        },
        KRSW: {
          icao: "KRSW",
          fullName: "Southwest Florida International Airport",
          metar: null,
          parsedMetar: null,
          configs: {
            landing: {
              E: "6",
              W: "24",
            },
            departing: {
              E: "6",
              W: "24",
            },
          },
          getLanding: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              return this.configs.landing.E;
            } else {
              if (
                this.parsedMetar.wind.direction >= 0 &&
                this.parsedMetar.wind.direction < 180
              ) {
                return this.configs.landing.E;
              } else {
                return this.configs.landing.W;
              }
            }
          },
          getDeparting: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              return this.configs.departing.E;
            } else {
              if (
                this.parsedMetar.wind.direction >= 0 &&
                this.parsedMetar.wind.direction < 180
              ) {
                return this.configs.departing.E;
              } else {
                return this.configs.departing.W;
              }
            }
          },
        },
        KPBI: {
          icao: "KPBI",
          fullName: "Palm Beach International Airport",
          metar: null,
          parsedMetar: null,
          configs: {
            landing: {
              E: "10L/14",
              W: "32/28R",
            },
            departing: {
              E: "14/10L",
              W: "28R/32",
            },
          },
          getLanding: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              return this.configs.landing.E;
            } else {
              if (
                this.parsedMetar.wind.direction >= 0 &&
                this.parsedMetar.wind.direction < 180
              ) {
                return this.configs.landing.E;
              } else {
                return this.configs.landing.W;
              }
            }
          },
          getDeparting: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              return this.configs.departing.E;
            } else {
              if (
                this.parsedMetar.wind.direction >= 0 &&
                this.parsedMetar.wind.direction < 180
              ) {
                return this.configs.departing.E;
              } else {
                return this.configs.departing.W;
              }
            }
          },
        },
        KEYW: {
          icao: "KEYW",
          fullName: "Key West International Airport",
          metar: null,
          parsedMetar: null,
          configs: {
            landing: {
              E: "9",
              W: "27",
            },
            departing: {
              E: "9",
              W: "27",
            },
          },
          getLanding: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              return this.configs.landing.E;
            } else {
              if (
                this.parsedMetar.wind.direction >= 0 &&
                this.parsedMetar.wind.direction < 180
              ) {
                return this.configs.landing.E;
              } else {
                return this.configs.landing.W;
              }
            }
          },
          getDeparting: function () {
            if (this.parsedMetar.wind.speedKt < 5) {
              return this.configs.departing.E;
            } else {
              if (
                this.parsedMetar.wind.direction >= 0 &&
                this.parsedMetar.wind.direction < 180
              ) {
                return this.configs.departing.E;
              } else {
                return this.configs.departing.W;
              }
            }
          },
        },
      },
      numStationsLoaded: 0,
    };
  },
  async mounted() {
    await this.getWeatherForAirports();
  },
  methods: {
    async getWeatherForAirports() {
      for (const station of this.icao) {
        const { data } = await zabApi.get(`/ids/stations/${station}`);
        this.stations[station].metar = data.metar;
        this.stations[station].parsedMetar = parse(data.metar);
        this.numStationsLoaded++;
      }
    },
    formatWind: function (station) {
      if (station.parsedMetar.wind.speedKt < 4) return "Calm";
      else if (!("speedKt" in station.parsedMetar.wind)) return "Unknown";
      const paddedWind = `0${station.parsedMetar.wind.direction}`.slice(-3);
      return `${paddedWind}@${station.parsedMetar.wind.speedKt}${
        station.parsedMetar.wind.gust ? `G${station.parsedMetar.wind.gust}` : ""
      }`;
    },
    getConditions: function (station) {
      return station.parsedMetar.visibility.miles > 3
        ? `<i class="material-icons weather_icon">wb_sunny</i>VFR`
        : `<i class="material-icons weather_icon">wb_cloudy</i>IFR`;
    },
  },
};
</script>

<style scoped lang="scss">
.airport_conditions {
  display: inline-flex;
  align-items: center;
  height: 33px;

  &::v-deep(i) {
    margin-right: 5px;
  }
}
.loading {
  text-align: center;
}

.progress {
  max-width: 500px;
  margin: 0 auto;
}

.table_overflow_wrapper {
  width: 100%;
  overflow-x: auto;
}

.weather_icon {
  padding-top: 1em;
}

tbody tr {
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #eaeaea !important;
  }
}
</style>
