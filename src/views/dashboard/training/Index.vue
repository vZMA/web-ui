<template>
	<div class="card">
		<div class="card-content">
			<div class="row row_no_margin">
				<div class="card-title col s12"><span class="card-title">Training Information and Queues</span></div>
				<div class="col s4 "><span><a
                  href="https://docs.google.com/document/d/1U717_AoxZC4Z2-la4DcCge7cnuHrrlK_X2Lnsar8msc/edit?pli=1"
                  target="_blank"
                  rel="noopener noreferrer" class="btn">Training Information</a></span></div>
				<div class="col s4"><span><a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSepMCaDsKmMNwez__TL8ZcbXpYHFR9xsFgle7I1--xPApxyjQ/viewform?usp=sf_linkhttps://docs.google.com/forms/d/e/1FAIpQLSepMCaDsKmMNwez__TL8ZcbXpYHFR9xsFgle7I1--xPApxyjQ/viewform?usp=sf_link"
                  target="_blank"
                  rel="noopener noreferrer" class="btn">Join Training Queue</a></span></div>
				<div class="col s4"><span><a
                  href="https://docs.google.com/spreadsheets/d/1Ibs035rON0f2djtOhQq4_3SCnd9Cx5eh2_FnowLFNbI/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer" class="btn">Training Queue</a></span></div>
				<!--<div class="col s4"><router-link to="/dash/training/new"><span class="btn new_event_button right">Request</span></router-link></div>-->
			</div>
		</div>
		<div class="loading_container" v-if="!upcomingSessions">
			<Spinner />
		</div>

		<!-- ADD Buttons for links to Google Training Pages -->

		<!--
		<p class="no_sessions" v-else-if="upcomingSessions && upcomingSessions.length === 0">You have no upcoming training sessions.</p>
		
		<div class="session_wrapper">
			<table class="session_list striped">
				<thead class="session_list_head">
					<tr>
						<th>Milestone</th>
						<th>Start Time</th>
						<th>End Time</th>
						<th>Instructor</th>
						<th class='options'>Options</th>
					</tr>
				</thead>
				<tbody class="session_list_row" v-if="upcomingSessions">
					<tr v-for="session in upcomingSessions" :key="session._id">
						<td>{{session.milestone.code + ' - ' + session.milestone.name}}</td>
						<td>{{dtLong(session.startTime)}}</td>
						<td>{{dtLong(session.endTime)}}</td>
						<td>{{session.instructor ? (session.instructor.fname + ' ' + session.instructor.lname) : 'Unfulfilled'}}</td>
						<td class="options">
                            <a :href="`#modal_delete_${session._id}`" data-position="top" data-tooltip="Cancel Training Session" 
							class="tooltipped modal-trigger"><i class="material-icons red-text text-darken-2">cancel</i></a>
                        </td>
                        <div :id="`modal_delete_${session._id}`" class="modal modal_delete">
                            <div class="modal-content">
                                <h4>Cancel Training Session?</h4>
								<p>You may cancel your training session at any time; however, if you are canceling this training session within 24 hours of the session start time,
									 it will be recorded and repeated cancellations within 24 hours may impact your availability to receive training in the future.</p>

								<p>Do you wish to continue?</p>
                            </div>
                            <div class="modal-footer">
                                <a href="#!" @click="deleteSession(session._id)" class="btn waves-effect">Delete</a>
                                <a href="#!" class="btn-flat waves-effect modal-close">Cancel</a>
                            </div>
                        </div>
					</tr>
				</tbody>
			</table>
		</div>-->
	</div>
	<PastSessions />
</template>

<script>
import {zabApi} from '@/helpers/axios.js';
import PastSessions from './Past.vue';

export default {
	name: 'TrainingDash',
	title: 'Training',
	data() {
		return {
			upcomingSessions: null,
			};
	},
	components: {
		PastSessions
	},
	async mounted() {
		//const Offset = parseInt(this.user.data.userTimezone) * 60000;
		await this.getUpcomingSessions();
				
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
   			margin: 0
			}) ;
		M.Modal.init(document.querySelectorAll('.modal'), {
		preventScrolling: false
			}) ;
		},

	methods: {
		async getUpcomingSessions() {
			const {data} = await zabApi.get(`/training/request/upcoming`);
			this.upcomingSessions = data.data;
		},

		async deleteSession(id)
		{
			console.log(id);
			const {data} = await zabApi.delete(`/training/request/${id}`);
			
			this.$nextTick(() => {
                        M.Modal.getInstance(document.querySelector('.modal_delete')).close();

			this.upcomingSessions = [];
			this.getUpcomingSessions();

			document.location.reload();
			});
		}
	}

};
</script>

<style scoped lang="scss">
.no_sessions {
	padding: 0 1em 1em 1em;
	margin-top: -1em;
	font-style: italic;
}

table {
	min-width: 500px;
}

.session_wrapper {
	overflow: auto;
}

.session_list {
	min-width: 500px;
}

.session_list_row {
	tr {
		transition: background-color .3s ease;
		&:hover {
			background: #eaeaea;
		}
	}
}
</style>