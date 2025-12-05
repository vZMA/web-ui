<template>
  <div class="card">
    <div class="card-content">

      <div class="title_row">
        <span class="card-title">Student Training Report</span>

        <div class="cid_input">
          <input
            v-model="cid"
            type="text"
            placeholder="Enter Student CID"
          >
        </div>
      </div>

      <div class="loading_container" v-if="loading === true">
        <Spinner />
      </div>

      <div v-if="loading === false && report.length === 0">
        No training data found.
      </div>

      <table
        v-if="loading === false && report.length > 0"
        class="striped"
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Student</th>
            <th>Instructor</th>
            <th>Milestone</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in report" :key="item._id">
            <td>{{ dtLong(item.date) }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.student }}</td>
            <td>{{ item.instructor }}</td>
            <td>{{ item.milestone }}</td>
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
      cid: '',
      report: [],
      loading: false,
      debounceTimer: null
    };
  },

  watch: {
    cid() {
      clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        this.loadReport();
      }, 500);
    }
  },

  methods: {
    dtLong(value) {
      return new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    async loadReport() {
      if (!this.cid) {
        this.report = [];
        return;
      }

      this.loading = true;

      try {
        const [reqRes, sesRes] = await Promise.all([
          zabApi.get(`/training/request/bystudent/${this.cid}`),
          zabApi.get(`/training/session/bystudent/${this.cid}`)
        ]);

        const requests = reqRes.data.data.map(r => ({
          _id: r._id,
          type: 'Request',
          date: r.startTime,
          student: `${r.student?.fname || ''} ${r.student?.lname || ''}`.trim(),
          instructor: `${r.instructor?.fname || ''} ${r.instructor?.lname || ''}`.trim(),
          milestone: r.milestoneCode
        }));

        const sessions = sesRes.data.data.map(s => ({
          _id: s._id,
          type: 'Session',
          date: s.startTime,
          student: `${s.student?.fname || ''} ${s.student?.lname || ''}`.trim(),
          instructor: `${s.instructor?.fname || ''} ${s.instructor?.lname || ''}`.trim(),
          milestone: s.milestoneCode
        }));

        const merged = [...requests, ...sessions];

        merged.sort((a, b) => new Date(b.date) - new Date(a.date));

        this.report = merged;
      } catch (err) {
        console.log(err);
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
  width: 150px;
}

.cid_input input {
  text-align: right;
}
</style>
