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
						
						<select v-model="session.studentCid" required class="materialize-select">
							<option value="" disabled selected>Select a Student</option>
							<option v-for="controller in controllers" :value="controller.cid" :key="controller.cid">{{controller.fname}} {{controller.lname}}</option>
						</select>
						<label>Student Name</label>
						
						<select v-model="session.instructorCid" required class="materialize-select">
							<option value="" disabled selected>Select an instructor</option>
							<option v-for="instructor in instructors" :value="instructor.cid" :key="instructor.cid">{{instructor.fname}} {{instructor.lname}}</option>
						</select>
						<label>Instructor Name</label>
						
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
<!--					<div class="input-field col s12 m6 milestone">
							<select required class="materialize-select">
								<option selected>{{session.milestone.name}}</option>
							</select>
							<label>Milestone</label>
						</div>-->
					</div>
					<div class="row row_no_margin">
						<div class="input-field col s12 submit_buttons">
							<button type="button" v-if="step === 3" class="btn right" @click="submitForm">Create Session</button>
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
	name: 'CreateNewSession',
	title: 'Create New Training Session',
	data() {
		return {
			instructors: null,
			controllers: null,
			session: {
				startTime: new Date(),
				endTime: new Date(Date.now() + 3600 * 1000),
				studentCid: null,
				instructor: { fname: '', lname: '' },
				milestone: { name: '' },
				position: '',
			},
			step: 1,
			duration: 0
		};
	},
	async mounted() {
		await this.getControllers();
		
		this.$nextTick(() => { 
			M.FormSelect.init(document.querySelectorAll('select'), {});
			M.Tooltip.init(document.querySelectorAll('.tooltipped'), {	margin: 0});
			M.CharacterCounter.init(document.querySelectorAll('textarea'), {});
		});
	},
	methods: {
		async getControllers() {
			const { data } = await zabApi.get("/controller/controllers");
			this.controllers = data.data;
			const { data1 } = await zabApi.get("/controller/ins-and-mts");
			this.instructors = data1.data;
			},
		async submitForm() {
				// Calculate the hours string for the session length
				const delta = Math.abs(new Date(this.session.endTime) - new Date(this.session.startTime)) / 1000;
				const hours = Math.floor(delta / 3600);
				const minutes = Math.floor(delta / 60) % 60;
				this.duration = `${('00' + hours).slice(-2)}:${('00' + minutes).slice(-2)}`;

				// Force Save the data to the local database
				try {
					const {data} = await zabApi.put(`/training/session/new`, {
						studentCid: this.session.studentCid,
						instructorCid: this.session.instructorCid,
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
						this.toastSuccess('Session created');
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