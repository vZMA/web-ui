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
                        it's 30 minutes or 4 hours (An OTS requires a minimum of two hours). 
						The Trainer has the ability to modify the session times to a more
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
								<!--<option v-for="milestone in filteredMilestones" :key="milestone._id" :value="milestone.code">{{milestone.code + ' - ' + milestone.name}}</option>-->
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

		// Adjust today to the nearest 15m window
		let minutes = today.getMinutes();
		let remainder = minutes % 15;
		if (remainder < 8) {
    		today.setMinutes(minutes - remainder);
		} else {
    		today.setMinutes(minutes + (15 - remainder));
		}
		today.setSeconds(0);
		today.setMilliseconds(0);
	
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

					// Check if this is an OTS and fix the window to a minimum of two hours
					if (this.request.milestone.startsWith('CR') && (end-start< 2*60*60*1000)) {
						end.setTime(start.getTime() + 2 * 60 * 60 * 1000);
					}

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
				
					if(this.user.data.vis) 
						return ( // visiting contollers 
								milestone.code === "T1" || // Always send back T1
								milestone.code === "T1CR" || // Always send back 
								
								// Show the visitor MIA certs when the MIA cert is not set on the controllers profile
								((milestone.certCode.substring(0, 3) === "vis" && !certs.includes(milestone.certCode.slice(-6)) && certs.includes(majorPrerequisites[milestone.rating - 1]))
								&& milestone.rating <= rating)); // respect the vatsim controller rating before offering training above that level
					else {
						return (  // home controllers
							!certs.includes(milestone.certCode) &&
							(
								milestone.code === "T1" || // Always send back T1 firss
								milestone.code === "T1CR" || 
								// Show the MIA certs, when the previous MIA cert has been acheived
								(milestone.certCode.substring(0, 3) === "mia" && certs.includes(milestone.certCode.slice(-3)) && certs.includes(majorPrerequisites[milestone.rating - 1])) || 

								// Show the non MIA certs, when the previous minor prereq has been achieved, or when no certification is valid for the observer, do not show ZMA C1
								(milestone.certCode.substring(0, 3) !== "mia" && (certs.includes(minorPrerequisites[milestone.rating - 1]) || 
								(milestone.rating === 1 && certs.length <= 1)) 
								&& milestone.certCode !== "zma") ||
								
								// Show ZMA C1 to users who have achieved miaapp
								(milestone.certCode === "zma" && certs.includes("miaapp")) || // Show the ZMA C1 when the Major Approach has been met
								
								// Show ZMO to users who have achieved zma
								(milestone.certCode === "zmo" && certs.includes("zma")) || // Show the ZMO when the domestic center has been met

								milestone.code === "OTS" // Always send back OTS in the last position
							) && milestone.rating <= rating // respect the vatsim controller rating before offering training above that level
							&& milestone.certCode.substring(0, 3) !== "vis"
						);
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
