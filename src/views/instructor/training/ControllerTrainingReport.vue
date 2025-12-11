<template>
  <div class="card">
    <div class="card-content">

      <!-- Title Row -->
      <div class="title_row">
        <span class="card-title">Student Training Report</span>

        <div class="cid_input dropdown-container">
          <input
            v-model="searchValue"
            type="text"
            placeholder="CID, Name, or OI"
            autocomplete="off"
            @focus="filterMatches"
          >
          <span class="helper-text right">Search by CID, name, or operating initials</span>

          <!-- Dropdown -->
          <ul v-if="matches.length > 0" class="dropdown z-depth-2">
            <li
              v-for="m in matches"
              :key="m.cid"
              class="dropdown-item"
              @click="selectStudent(m)"
            >
              <span class="name">{{ m.fname }} {{ m.lname }}</span>
              <span class="cid">CID: {{ m.cid }} &nbsp; OI: {{ m.oi }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div class="loading_container" v-if="loading">
        <Spinner />
      </div>

      <!-- No Results -->
      <div v-if="!loading && report.length === 0">
        No training data found.
      </div>

      <!-- Training Report Table -->
      <table v-if="!loading && report.length > 0" class="striped">
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
            <th>Type</th>
            <th>Student</th>
            <th>Instructor</th>
            <th>Milestone</th>
            <th>Requested</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in report"
            :key="item._id"
            :class="item.type === 'Session' ? 'row-session' : 'row-request'"
          >
            <td>{{ dtLong(item.date) }}</td>
            <td>{{ item.end ? dtLong(item.end) : '' }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.student }}</td>
            <td>{{ item.instructor }}</td>
            <td>{{ item.milestone }}</td>
            <td>{{ item.requested ? dtLong(item.requested) : '' }}</td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>


<script>
import { zabApi } from '@/helpers/axios.js';
import Spinner from '@/components/Spinner.vue';

export default {
  name: 'StudentTrainingReport',

  data() {
    return {
      searchValue: '',
      controllers: [],
      matches: [],
      report: [],
      loading: false,
      debounceTimer: null
    };
  },

  async mounted() {
    await this.loadControllers();
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  watch: {
    searchValue() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.filterMatches();
      }, 300);
    }
  },

  methods: {
    async loadControllers() {
      const { data } = await zabApi.get('/controller');
      const all = data.data.home.concat(data.data.visiting);
      this.controllers = all.filter(c => c.member);
    },

    dtLong(v) {
      return new Date(v).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    filterMatches() {
      const text = this.searchValue.trim();
      if (!text) {
        this.matches = [];
        return;
      }

      const search = new RegExp(text, "i");

      this.matches = this.controllers.filter(c =>
        c.fname.match(search) ||
        c.lname.match(search) ||
        c.oi.match(search) ||
        c.cid.toString().match(search)
      );

      this.matches = this.matches.slice(0, 8);
    },

    async selectStudent(m) {
      this.searchValue = `${m.fname} ${m.lname}`;
      this.matches = [];
      await this.loadReportForCID(m.cid);
    },

    handleClickOutside(event) {
      const dropdown = this.$el.querySelector(".dropdown");
      const input = this.$el.querySelector("input");

      if (dropdown && !dropdown.contains(event.target) && event.target !== input) {
        this.matches = [];
      }
    },

    async loadReportForCID(cid) {
      this.loading = true;

      try {
        const [reqRes, sesRes] = await Promise.all([
          zabApi.get(`/training/request/bystudent/${cid}`),
          zabApi.get(`/training/session/bystudent/${cid}`)
        ]);

        const requests = reqRes.data.data.map(r => {
          const start = new Date(r.startTime);
          const end = new Date(start.getTime() + (r.duration || 0) * 60000);

          return {
            _id: r._id,
            type: 'Request',
            requested: r.createdAt,
            date: r.startTime,
            end: end,
            student: `${r.student?.fname} ${r.student?.lname}`,
            instructor: `${r.instructor?.fname || ''} ${r.instructor?.lname || ''}`,
            milestone: r.milestoneCode
          };
        });

        const sessions = sesRes.data.data.map(s => ({
          _id: s._id,
          type: 'Session',
          requested: s.createdAt,
          date: s.startTime,
          end: s.endTime,
          student: `${s.student?.fname} ${s.student?.lname}`,
          instructor: `${s.instructor?.fname || ''} ${s.instructor?.lname || ''}`,
          milestone: s.milestoneCode
        }));

        const merged = [...requests, ...sessions];

        // Enhanced sorting: newest first, sessions above requests if same time
        merged.sort((a, b) => {
          const dateDiff = new Date(b.date) - new Date(a.date);
          if (dateDiff !== 0) return dateDiff;

          if (a.type === 'Session' && b.type === 'Request') return -1;
          if (a.type === 'Request' && b.type === 'Session') return 1;

          return 0;
        });

        this.report = merged;
      } catch (e) {
        console.log(e);
      }

      this.loading = false;
    }
  }
};
</script>


<style scoped>
.title_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cid_input {
  width: 260px;
  position: relative;
}

.dropdown-container {
  position: relative;
}

.dropdown {
  position: absolute;
  width: 100%;
  background: white;
  list-style: none;
  margin: 4px 0 0 0;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 240px;
  overflow-y: auto;
  z-index: 2000;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #eee;
}

.dropdown-item .name {
  font-weight: 600;
  color: #333;
}

.dropdown-item .cid {
  font-size: 0.85em;
  color: #777;
}

/* Color coding */
.row-session {
  background-color: #e8f5e9;
}

.row-request {
  background-color: #fff3e0;
}

.row-session:hover,
.row-request:hover {
  background-color: #e0e0e0;
}
</style>
