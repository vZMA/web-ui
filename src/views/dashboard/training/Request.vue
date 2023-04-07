<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">New Training Request</span>
			<div class="loading_container" v-if="!milestones">
				<Spinner />
			</div>
			<div class="request_wrapper row row_no_margin" v-else>
				<div class="col s12 l6 push-l6">
                    <p>
                        <b class="red-text">IMPORTANT:</b> PLEASE READ THESE INSTRUCTIONS.<br/><br/>
                        When choosing your availability, please include the entire window of your availability, whether
                        it's 30 minutes or 4 hours. The Trainer has the ability to modify the session times to a more
                        reasonable duration, if needed, when s/he picks up the training session.
                    </p>
                    <br>
                    <b>By submitting this training request, you acknowledge:</b>
                    <ol>
                        <li>This is a <em>request</em> and not a guarantee of training.</li>
                        <li>You are required to keep your availability up-to-date.</li>
                        <li>You have completed the pre-requisites as outlined in the applicable Training Program
                            document.
                        </li>
                    </ol>
				</div>
				<div class="col s12 l6 pull-l6">
					<form class="row row_no_margin" @submit.prevent=submitRequest>
						<div class="input-field col s12">
							<input id="start_date" type="text" ref="start_date" required>
							<label for="start_date">Start Time (Local)<span class="red-text">*</span></label>
						</div>
						<div class="input-field col s12">
							<input id="end_date" type="text" ref="end_date" required>
							<label for="end_date">End Time (Local)<span class="red-text">*</span></label>
						</div>
						<div class="input-field col s12">
							<select v-model="request.milestone" class="materialize-select">
								<option value="" disabled selected>Select a milestone</option>
								<option v-for="milestone in filteredMilestones" :key="milestone._id" :value="milestone.code">{{milestone.code + ' - ' + milestone.name}}</option>
								
							</select>
							<label>Milestone <span class="red-text">*</span></label>
						</div>
						<div class="input-field col s12">
							<textarea id="remarks" class="materialize-textarea" data-length="500" v-model="request.remarks"></textarea>
							<label for="remarks" class="active">Remarks</label>
						</div>
						<div class="submit_request">
							<input type="submit" class="btn" value="Request" :disabled="makingRequest" />
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { zabApi } from '@/helpers/axios.js';
import { mapState } from 'vuex';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default {
	name: 'RequestTraining',
	title: 'Request Training',
	data() {
		return {
			request: {
				milestone: '',
				remarks: '',
				submitter: ''
			},
			milestones: null,
			makingRequest: false
		};
	},
	async mounted() {
		await this.getTrainingMilestones();
		const today = new Date(new Date().toUTCString());

		M.FormSelect.init(document.querySelectorAll('select'), {});
		M.CharacterCounter.init(document.querySelectorAll('textarea'), {});

		this.request.submitter = this.user.data._id;

		flatpickr(this.$refs.start_date, {
			enableTime: true,
			utc:false,
			time_24hr: true,
			minDate: today,
			disableMobile: true,
			minuteIncrement: 15,
			dateFormat: 'Y-m-dTH:i:00.000',
			altFormat: 'Y-m-d H:i',
			altInput: true,
		});

		flatpickr(this.$refs.end_date, {
			enableTime: true,
			uc:false,
			time_24hr: true,
			minDate: today,
			disableMobile: true,
			minuteIncrement: 15,
			dateFormat: 'Y-m-dTH:i:00.000',
			altFormat: 'Y-m-d H:i',
			altInput: true,
		});
	},
	methods: {
		async submitRequest() {
			try {
				if(!this.request.milestone) {
					this.toastError('You must select a milestone');
				} else {
					// Apply the correction for UTC to the local dates collected
					const offset = new Date().getTimezoneOffset();
					const start = new Date(this.$refs.start_date.value);
					//start.setUTCMinutes(start.getMinutes()+offset);
					const end = new Date(this.$refs.end_date.value);
					//end.setUTCMinutes(end.getMinutes()+offset);
								
					this.makingRequest = true;
					const {data} = await zabApi.post('/training/request/new', {
						...this.request,
						startTime: start,
						endTime: end
					});
					if(data.ret_det.code === 200) {
						this.toastSuccess('Training session requested');
						this.$router.push('/dash/training');
						this.makingRequest = false;
					} else {
						this.toastError(data.ret_det.message);
						this.makingRequest = false;
					}
				}
			} catch(e) {
				console.log(e);
			}
		},
		async getTrainingMilestones() {
			const {data} = await zabApi.get(`/training/milestones`);
			this.milestones = data.data.milestones;
		}
	},
	computed: {
		filteredMilestones() {
			const certs = this.user.data.certCodes;
			const rating = this.user.data.rating;

			if(this.milestones !== null) {
				const minorPrerequisites = ["obs", "gnd", "twr", "app"];
				const majorPrerequisites = ["obs", "gnd", "miagnd", "miatwr", "miaapp"];

				let milestonesShowed = this.milestones.filter((milestone) => {
					//simplified this logic per TA request to offer only these options to all trainees, regardless of cert held
					if(this.user.data.vis) {
							return milestone.code === "TRN" || milestone.code === "GRP" || milestone.code === "MOTS";
					} else {
							//simplified this logic per TA request to offer only these options to all trainees, regardless of cert held
							return milestone.code === "TRN" || milestone.code === "GRP" || milestone.code === "MOTS" || milestone.code === "ROTS";
					}
				});

				return milestonesShowed;
			}
		},
		...mapState('user', [
			'user'
		])
	}

};
</script>

<style scoped lang="scss">
.request_wrapper {
	padding-top: 1em;

	.col {
		margin-bottom: 1em;
	}
}

.submit_request {
	margin-left: .75em;
}
</style>
