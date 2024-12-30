<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">
				Create New Session
			</span>
			<div class="loading_container" v-if="session === null">
				<Spinner />
			</div>
			<div class="session_notes" v-else>
				<form>
					<div class="row row_no_margin">
						
						<div class="input-field col s4 m6">
						  <select id="student" v-model="session.studentCid" required class="materialize-select">
							<option value="">Select a Student</option>
							<option v-for="controller in controllers" :value="controller.cid" :key="controller.cid">
							{{controller.fname}} {{controller.lname}}
							</option>
						</select>
						<label for="student">Student Name</label>
						</div>

						<div class="input-field col s4 m6">
						  <select id="instructor" v-model="session.instructorCid" required class="materialize-select">
							<option value="">Select an Instructor</option>
							<option v-for="instructor in instructors" :value="instructor.cid" :key="instructor.cid">
							{{instructor.fname}} {{instructor.lname}}
							</option>
						</select>
						<label for="instructor">Instructor Name</label>
						</div>
			
						<div class="input-field col s12">
							<input id="start_date" type="text" ref="start_date" required>
							<label for="start_date">Start Time (Local)<span class="red-text">*</span></label>
						</div>
						<div class="input-field col s12">
							<input id="end_date" type="text" ref="end_date" required>
							<label for="end_date">End Time (Local)<span class="red-text">*</span></label>
						</div>

						<div class="input-field col s6 m6 milestone">
							<select required v-model="session.milestoneCode" class="materialize-select">
								<option value="" disabled selected>Select an option</option>
								<option value="T1">Tier 1</option>
								<option value="T1CR">Tier 1 Checkride</option>
								<option value="TRN-S1">S1 Qualification Program</option>
								<option value="CR-S1">S1 Checkride</option>
								<option value="TRN-S2">S2 Qualification Program</option>
								<option value="CR-S2">S2 Checkride</option>
								<option value="TRN-S3">S3 Qualification Program</option>
								<option value="CR-S3">S3 Checkride</option>
								<option value="TRN-C1">C1 Qualification Program</option>
								<option value="CR-C1">C1 Checkride</option>
								<option value="TRN-ZMO">Oceanic Qualification Program</option>
								<option value="CR-ZMO">Oceanic Checkride</option>
							</select>
							<label for="milestone">Milestone</label>
						</div>

					</div>
					<div class="row row_no_margin">
						<div class="input-field col s12 submit_buttons">
							<button type="button" class="btn right" @click="submitForm">Create Session</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import {zabApi, vatusaApi, vatusaApiAuth} from '@/helpers/axios.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default {
	name: 'CreateNewSession',
	title: 'Create New Training Session',
	data() {
		return {
			instructors: [],
			controllers: [],
			session: {
				startTime: new Date(),
				endTime: new Date(Date.now() + 3600 * 1000),
				studentCid: null,
				instructorCid: null,
				instructor: { fname: '', lname: '' },
				milestoneCode: { name: '' },
				position: '',
			},
			step: 1,
			duration: 0
		};
	},
	async mounted() {
		await this.getControllers();
		await this.getInstructors();
		
		this.$nextTick(() => { 
			M.FormSelect.init(document.querySelectorAll('select'), {});
			M.Tooltip.init(document.querySelectorAll('.tooltipped'), {	margin: 0});
			M.CharacterCounter.init(document.querySelectorAll('textarea'), {});
		});
		flatpickr(this.$refs.start_date, {
				enableTime: true,
				time_24hr: true,
				dateFormat: "Y-m-d H:i", // Adjust the format as needed
				altInput: true,
				altFormat: "F j, Y H:i",
				onChange: (selectedDates) => {
				this.session.startTime = selectedDates[0];
				}
			});

		// Initialize Flatpickr for end date
		flatpickr(this.$refs.end_date, {
			enableTime: true,
			time_24hr: true,
			dateFormat: "Y-m-d H:i", // Adjust the format as needed
			altInput: true,
			altFormat: "F j, Y H:i",
			onChange: (selectedDates) => {
			this.session.endTime = selectedDates[0];
			}
		});
		
	},
	methods: {
		async getControllers() {
			const { data } = await zabApi.get("/controller/controllers");
			this.controllers = data.data;
			this.$nextTick(() => {
  				M.FormSelect.init(document.querySelectorAll('select'), {});
			});
		},
		async getInstructors() {	
			const { data } = await zabApi.get("/controller/ins-and-mts");
			this.instructors = data.data;
			this.$nextTick(() => {
  				M.FormSelect.init(document.querySelectorAll('select'), {});
			});
		},
		async submitForm() {
				// Calculate the hours string for the session length
				const delta = Math.abs(new Date(this.session.endTime) - new Date(this.session.startTime)) / 1000;
				const hours = Math.floor(delta / 3600);
				const minutes = Math.floor(delta / 60) % 60;
				this.duration = `${('00' + hours).slice(-2)}:${('00' + minutes).slice(-2)}`;
				const offset = new Date().getTimezoneOffset();
				const start = new Date(this.$refs.start_date.value);
				const end = new Date(this.$refs.end_date.value);
			
				try {
					const {data} = await zabApi.post(`/training/session/new`, {
						studentCid: this.session.studentCid,
						instructorCid: this.session.instructorCid,
						milestoneCode: this.session.milestoneCode,
						position: this.session.position,
						movements: this.session.movements,
						progress: this.session.progress,
						ots: this.session.ots,
						location: this.session.location,
						startTime: start,
						endTime: end,
						studentNotes: this.session.studentNotes,
						insNotes: this.session.insNotes
						});
					if(data.ret_det.code === 200) {
						this.toastSuccess('Session created');
						this.$router.push('/ins/sessions');
					} else {
						this.toastError(data.ret_det.message);
					}
				} catch(e) {
				console.log(e);
			}	
		},
		formatHtmlDate(value) {
			//const d = new Date(value).toISOString();
			//return d.replace('T', ' ').slice(0,16);
			const d = new Date(value);
  			const timezoneOffset = d.getTimezoneOffset() * 60000; // convert to milliseconds
  			const localISOTime = (new Date(d.getTime() - timezoneOffset)).toISOString().slice(0, 16);
  			return localISOTime.replace('T', ' ');
		},

		increaseTime(type) {
			if(type === 'start'  && new Date(this.session.startTime) < new Date(this.session.endTime)-900000) {
				let d = new Date(this.session.startTime);
				d.setUTCMinutes(d.getUTCMinutes() + 15);
				this.session.startTime = d.toISOString();
			} else if(type === 'end') {
				let d = new Date(this.session.endTime);
				d.setUTCMinutes(d.getUTCMinutes() + 15);
				this.session.endTime = d.toISOString();
			}
		},
		decreaseTime(type) {
			if(type === 'end' && new Date(this.session.endTime)-900000 > new Date(this.session.startTime)) {
				let d = new Date(this.session.endTime);
				d.setUTCMinutes(d.getUTCMinutes()-15);
				this.session.endTime = d.toISOString();		
			} else if(type === 'start') {
				let d = new Date(this.session.startTime);
				d.setUTCMinutes(d.getUTCMinutes()-15);
				this.session.startTime = d.toISOString();
			}
		}
	}
};
</script>

<style scoped lang="scss">
label {
	.material-icons {
		font-size: 17px;
		display: inline-flex;
		vertical-align: top;
		margin-top: .25em;
		user-select: none;
		cursor: pointer;
	}
}

.submit_buttons {
	input {
		margin-left: .5em;
	}
}

.stepper {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 1em 0;

	.step {
		background: lightgray;
		font-weight: 600;
		text-shadow: 1px 1px gray;
		color: #fff;
		height: 2.5em;
		width: 2.5em;
		padding: .45em .92em;
		border-radius: 50%;
		transition: .3s ease;

		&.active {
			background: $primary-color-light;
			text-shadow: 1px 1px $primary-color;
		}
	}

	.stepper_divider {
		flex-grow: 1;
		height: 1px;
		margin-left: 1em;
		margin-right: 1em;
		margin-top: 1.25em;
		background: lightgray;
	}
}

#start_time, #end_time {
	.date {
		margin-top: .5em;
		height: 2.3rem;
		padding-top: .3em;
		border-bottom: 1px solid #9E9E9E;
		font-size: 16px;
		line-height: 1.15;
	}

	.controls {
		height: 15px;
		margin-top: -2.5em;
		margin-left: calc(100% - 20px);

		div:first-child {
			margin-top: -5px;
		}

		div:not(:first-child) {
			margin-top: 0px;
			
		}

		div {
			cursor: pointer;
			user-select: none;
			height: 15px;
			margin-top: -10px;
		}
	}
}

.milestone, .position {
	margin-top: 3em;
}
</style>