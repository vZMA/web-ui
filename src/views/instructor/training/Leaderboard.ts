<template>
  <div class="card">
    <div class="card-content">

      <div class="title_row">
        <span class="card-title">Student Training Report</span>

        <div class="cid_input">
          <input
            v-model="searchValue"
            type="text"
            placeholder="CID, Name, or OI"
            autocomplete="off"
          >
          <span class="helper-text right">Search by CID, name, or operating initials</span>
        </div>
      </div>

      <div class="loading_container" v-if="loading">
        <Spinner />
      </div>

      <div v-if="!loading && report.length === 0">
        No training data found.
      </div>

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
          <tr v-for="item in report" :key="item._id">
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
      report: [],
      loading: false,
      debounceTimer: null
    };
  },

  async mounted() {
    await this.loadControllers();
  },

  watch: {
    searchValue() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.loadReport();
      }, 400);
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

    filterMatchingControllers() {
      const search = new RegExp(this.searchValue, 'ig');
      return this.controllers.filter(c =>
        c.fname.match(search) ||
        c.lname.match(search) ||
        c.oi.match(search) ||
        c.cid.toString().match(search)
      );
    },

    async loadReport() {
      const text = this.searchValue.trim();
      if (!text) {
        this.report = [];
        return;
      }

      this.loading = true;

      try {
        // Use the SAME logic as the Controllers page
        const matches = this.filterMatchingControllers();
        const cids = matches.map(c => c.cid);

        let results = [];

        for (const cid of cids) {
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
              student: `${r.student?.fname} ${r.student?.lname}`.trim(),
              instructor: `${r.instructor?.fname || ''} ${r.instructor?.lname || ''}`.trim(),
              milestone: r.milestoneCode
            };
          });

          const sessions = sesRes.data.data.map(s => ({
            _id: s._id,
            type: 'Session',
            requested: s.createdAt,
            date: s.startTime,
            end: s.endTime,
            student: `${s.student?.fname} ${s.student?.lname}`.trim(),
            instructor: `${s.instructor?.fname || ''} ${s.instructor?.lname || ''}`.trim(),
            milestone: s.milestoneCode
          }));

          results.push(...requests, ...sessions);
        }

        results.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.report = results;
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
  width: 240px;
}

.cid_input input {
  text-align: right;
}
</style>
eaqde