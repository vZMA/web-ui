<template>
	<div class="card">
		<div class="card-content">
			<div class="card-title col s6 m6">Your Training Sessions</div>
			<div class="col s6 m6" ><router-link to="/ins/training/session/new"><span class="btn waves-effect waves-light right">Create Session</span></router-link></div>
		</div>
		
		<!-- Add a new button in here to trigger the edit session page -->
		
		<div v-if="sessions === null" class="loading_container">
			<Spinner />
		</div>
		<div v-else-if="sessions.length === 0" class="no_sessions">
			You have no open training sessions
		</div>
		<div class="sessions_wrapper" v-else>
			<table class="sessions_list striped">
				<thead class="sessions_list_head">
					<tr>
						<th>Student</th>
						<th>Milestone</th>
						<th>Start</th>
						<th>End</th>
						<th class="options">Options</th>
					</tr>
				</thead>
				<tbody class="sessions_list_row">
					<tr v-for="(session, i) in sessions" :key="session._id">
						<td>{{session.student.fname + ' ' + session.student.lname}} <span v-if="session.student.vis === true">(VC)</span></td>
						<td>{{session.milestoneCode}}</td>
						
						<td>{{dtLong(session.startTime)}}</td>
						<td>{{dtLong(session.endTime)}}</td>
						<td class="options">
							<a :href="`#modal_session_${i}`" data-position="top" data-tooltip="View Details" class="tooltipped modal-trigger">
								<i class="material-icons">search</i>
							</a>
							<router-link :to="`/ins/training/session/edit/${session._id}`" data-position="top" data-tooltip="Enter Notes" class="tooltipped">
								<i class="material-icons">edit</i>
							</router-link>
							<a :href="`#modal_session_delete${i}`" data-position="top" data-tooltip="Cancel Session" class="tooltipped modal-trigger">
								<i class="material-icons">cancel</i>
							</a>
						</td>
						<div :id="`modal_session_${i}`" class="modal modal_session">
							<div class="modal-content">
								<div class="modal_title">Training Session Details</div>
								<div class="session">
									<div class="row row_no_margin" id="session">
										<div class="input-field col s6">
											<p id="student">{{session.student.fname + ' ' + session.student.lname}} <span v-if="session.student.vis === true">(VC)</span></p>
											<label for="student" class="active">Student</label>
										</div>
										<div class="input-field col s6">
											<p id="milestone">{{session.milestoneCode}}</p>
											<label for="milestone" class="active">Milestone</label>
										</div>
										<div class="input-field col s6">
											<p id="startTime">{{dtLong(session.startTime)}}</p>
											<label for="startTime" class="active">Start Time</label>
										</div>
										<div class="input-field col s6">
											<p id="endTime">{{dtLong(session.endTime)}}</p>
											<label for="endTime" class="active">End Time</label>
										</div>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<a href="#!" class="waves-effect btn-flat modal-close">Close</a>
							</div>
						</div>
						<div :id="`modal_session_delete${i}`" class="modal modal_session">
							<div class="modal_title">Cancel Training Session</div>
							<div class="session">
								<div class="row row_no_margin" id="session">
									<div class="input-field col s6">
										<p id="student">{{session.student.fname + ' ' + session.student.lname}} <span v-if="session.student.vis === true">(VC)</span></p>
										<label for="student" class="active">Student</label>
									</div>
									<div class="input-field col s6">
										<p id="milestone">{{session.milestoneCode}}</p>
										<label for="milestone" class="active">Milestone</label>
									</div>
									<div class="input-field col s6">
										<p id="startTime">{{dtLong(session.startTime)}}</p>
										<label for="startTime" class="active">Start Time</label>
									</div>
									<div class="input-field col s6">
										<p id="endTime">{{dtLong(session.endTime)}}</p>
										<label for="endTime" class="active">End Time</label>
									</div>
								</div>
							</div>
							<div>
								To Cancel the training session and remove it from the system, press <b>'CANCEL SESSION'</b>, or press 'Close'.
							</div>
							<div class="modal-footer">
								<a href="#!" @click="deleteSession(session._id)" class="btn waves-effect">CANCEL SESSION</a>
								<a href="#!" class="waves-effect btn-flat modal-close">Close</a>
							</div>
						</div>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<Completed />
</template>

<script>
import {zabApi} from '@/helpers/axios.js';
import Completed from './Completed.vue';

export default {
	name: 'UpcomingSessions',
	title: 'Training Sessions',
	data() {
		return {
			sessions: null
		};
	},
	components: {
		Completed
	},
	async mounted() {
		await this.getSessions();

		M.Modal.init(document.querySelectorAll('.modal'), {
			preventScrolling: false
		});
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			margin: 0
		});
	},
	methods: {
		async getSessions() {
			try {
				const {data} = await zabApi.get(`/training/session/open`);
				this.sessions = data.data;
			} catch(e) {
				console.log(e);
			}
		},
		async deleteSession(id)
		{
			const {data} = await zabApi.delete(`/training/session/${id}`);
			
			this.sessions =[];
			this.getSessions();

			this.$nextTick(() => {
                        M.Modal.getInstance(document.querySelector('.modal_delete')).close();
						})

			document.location.reload();
		},
		formatDateTime(value) {
			const d = new Date(value);
			return d.toLocaleString('en-US', {month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC', hour12: false});
		},
	}
};
</script>

<style scoped lang="scss">
.no_sessions {
	font-style: italic;
	margin-top: -1em;
	padding: 0 1em 1em 1em;
}

.modal_title {
	font-size: 1.8em;
	margin-bottom: .5em;
}

.session_list {
	min-width: 500px;
}

.modal_session {
	.row {
		.input-field p {
			line-break: normal;
			hyphens: auto;
			margin: .33em 0 0 0;
		}
	}
}
</style>