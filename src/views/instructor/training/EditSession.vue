<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">
				Enter Session Notes
			</span>
			<div class="loading_container" v-if="session === null">
				<Spinner />
			</div>
			<div class="session_notes" v-else>
				<div class="stepper">
					<div :class="`step active`">
						<span v-html='step === 1 ? "1" : `<i class="material-icons" style="margin-left: -6px">check</i>`'></span>
					</div>
					<div class="stepper_divider"></div>
					<div :class="`step ${step > 1 ? 'active' : ''}`">
						<span v-html='step < 3 ? "2" : `<i class="material-icons" style="margin-left: -6px">check</i>`'></span>
					</div>
					<div class="stepper_divider"></div>
					<div :class="`step ${step > 2 ? 'active' : ''}`">3</div>
				</div>
				<form>
					<div class="row row_no_margin" v-show="step === 1">
						<div class="input-field col s12 m6">
							<input id="student" type="text" :value="session.student.fname + ' ' + session.student.lname" required disabled>
							<label for="student" class="active">Student Name</label>
						</div>
						<div class="input-field col s12 m6">
							<input id="instructor" type="text" :value="session.instructor.fname + ' ' + session.instructor.lname" required disabled>
							<label for="instructor" class="active">Instructor Name</label>
						</div>
						<div class="input-field col s12 m6">
							<div id="start_time">
								<div class="date">{{formatHtmlDate(session.startTime)}}</div>
								<div class="controls">
									<div><i class="material-icons" @click="increaseTime('start')">arrow_drop_up</i></div>
									<div><i class="material-icons" @click="decreaseTime('start')">arrow_drop_down</i></div>
								</div>
							</div>
							<label for="start_time" class="active">Start Time (Local)</label>
						</div>
						<div class="input-field col s12 m6">
							<div id="end_time">
								<div class="date">{{formatHtmlDate(session.endTime)}}</div>
								<div class="controls">
									<div><i class="material-icons" @click="increaseTime('end')">arrow_drop_up</i></div>
									<div><i class="material-icons" @click="decreaseTime('end')">arrow_drop_down</i></div>
								</div>
							</div>
							<label for="end_time" class="active">End Time (Local) </label>
						</div>
						<div class="input-field col s12 m6 milestone">
							<select required disabled class="materialize-select">
								<option disabled selected>{{session.milestone.name}}</option>
							</select>
							<label>Milestone</label>
						</div>
						<div class="input-field col s12 m6 position">
							<input id="position" type="text" required v-model="session.position">
							<label for="position" class="active">Position</label>
						</div>
					</div>
					<div class="row row_no_margin" v-show="step === 2">
						<div class="input-field col s12 m6">
							<input id="movements" type="number" min="0" max="500" required v-model="session.movements">
							<label for="movements" class="active">Movements</label>
						</div>
						<div class="input-field col s12 m6">
							<select required v-model="session.location" class="materialize-select">
								<option value="" disabled selected>Select a location</option>
								<option value=0>Classroom</option>
								<option value=1>Live Network</option>
								<option value=2>Sweatbox</option>
							</select>
							<label>Location</label>
						</div>
						<div class="input-field col s12 m6">
							<select required v-model="session.progress" class="materialize-select">
								<option value="" disabled selected>Select an option</option>
								<option value=1>No Progress</option>
								<option value=2>Little Progress</option>
								<option value=3>Average Progress</option>
								<option value=4>Great Progress</option>
								<option value=5>Exceptional Progress</option>
							</select>
							<label>Progress</label>
						</div>
						<div class="input-field col s12 m6">
							<select required v-model="session.ots" class="materialize-select">
								<option value="" disabled selected>Select an option</option>
								<option value=0>No OTS</option>
								<option value=1>OTS Pass</option>
								<option value=2>OTS Fail</option>
								<option value=3>Recommend OTS</option>
							</select>
							<label>OTS</label>
						</div>
						<div class="input-field col s12 m6">
							<select required v-model="session.solo_granted" class="materialize-select">
								<option value="" disabled selected>Select an option</option>
								<option value=0>Not Issued</option>
								<option value=1>Issued</option>
							</select>
							<label>Solo Certificate</label>
						</div>
					</div>
					<div class="row row_no_margin" v-show="step === 3">
						<div class="input-field col s12">
							<textarea id="studentNotes" class="materialize-textarea" data-length="3000" v-model="session.studentNotes"></textarea>
							<label for="studentNotes" class="active">Student Notes <i class="material-icons tooltipped" data-position="right" data-tooltip="Notes visible to the student">help</i></label>
						</div>
						<div class="input-field col s12">
							<textarea id="insNotes" class="materialize-textarea" data-length="3000" v-model="session.insNotes"></textarea>
							<label for="insNotes" class="active">Instructor Notes <i class="material-icons tooltipped" data-position="right" data-tooltip="Notes visible to training staff only">help</i></label>
						</div>
					</div>
					<div class="row row_no_margin">
						<div class="input-field col s12 submit_buttons">
							<button type="button" v-if="step === 3" class="btn right" @click="submitForm">Push to Vatsim and Lock</button>
							<button type="button" v-if="step === 3" class="btn-flat right" @click="saveForm">Save</button>
							<button type="button" class="btn right" v-if="step !== 3" @click="step += 1">Next</button>
							<button type="button" v-if="step !== 1" @click="step -= 1" class="btn-flat right">Back</button>
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

export default {
	name: 'EditSessionNotes',
	title: 'Enter Session Notes',
	data() {
		return {
			session: null,
			step: 1,
			duration: 0
		};
	},
	async mounted() {
		await this.getSessionDetails();

		this.setTimes();

		M.FormSelect.init(document.querySelectorAll('select'), {});
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			margin: 0
		});
		M.CharacterCounter.init(document.querySelectorAll('textarea'), {});
	},
	methods: {
		async getSessionDetails() {
			try {
				const {data} = await zabApi.get(`/training/session/${this.$route.params.id}`);
				this.session = data.data;
			} catch(e) {
				console.log(e);
			}
		},
		async saveForm() {
			try {
				const {data} = await zabApi.put(`/training/session/save/${this.$route.params.id}`, {
					position: this.session.position,
					movements: this.session.movements,
					progress: this.session.progress,
					ots: this.session.ots,
					location: this.session.location,
					startTime: this.session.startTime,
					endTime: this.session.endTime,
					studentNotes: this.session.studentNotes,
					insNotes: this.session.insNotes
				});
				if(data.ret_det.code === 200) {
					this.toastSuccess('Session notes saved');
					this.$router.push('/ins/training/sessions');
				} else {
					this.toastError(data.ret_det.message);
				}
			} catch(e) {
				console.log(e);
			}
		},
		async submitForm() {
		
				// In theory, we get here when the user presses 'Push to Vatsim and Lock'
				
				// Calculate the hours string for the session length
				const delta = Math.abs(new Date(this.session.endTime) - new Date(this.session.startTime)) / 1000;
				const hours = Math.floor(delta / 3600);
				const minutes = Math.floor(delta / 60) % 60;
				this.duration = `${('00' + hours).slice(-2)}:${('00' + minutes).slice(-2)}`;

				// Force Save the data to the local database
				await this.saveForm();


				// Error check the fields
				if (!this.session.location)
					this.toastError("Location is required on page 2");
				if (!this.session.studentNotes)
					this.toastError("Student Notes are required on page 3");

				if (this.session.location != null &&
					this.session.studentNotes != null) {
					try {	// Hit the local database to Finalize the record
				
						const {data} = await zabApi.put(`/training/session/submit/${this.$route.params.id}`, this.session);
						if(data.ret_det.code === 200) {
						// Put a little message on screen saying success
							this.toastSuccess('Session notes finalized')							
							this.$router.push('/ins/training/sessions');
							}
						else {
							this.toastError(data.ret_det.message);	
						}
					} catch(e) {
						console.log(e);
						this.$router.push('/ins/training/sessions');			
					}
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
		setTimes() {
			this.oldTimes = {
				startTime: this.session.startTime,
				endTime: this.session.endTime
			};
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