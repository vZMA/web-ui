<template>
	<div class="card home_intro">
		<div class="card-content">
			<span class="card-title">Controller Dashboard</span>
			<div class="loading_container" v-if="!controllingSessions">
				<Spinner />
			</div>
			<div v-else>
				<div class="hours_info">
					<span>
						You have controlled for <b>{{hoursCalc}}</b> in the current quarter.<br><br>
					</span>
					<span v-if="user.data.rating !== 1">
						Per SOP D1 13.3 policy you are required to control for a minimum of three hours every quarter to prevent removal from the roster.
					</span>
				</div>
				<span class="section_title">
					External Integrations
				</span>
				<div class="discord_connect">
					<button class="btn waves-effect waves-light">
					<a href="https://vats.im/zma/discord" target="_blank" rel="noreferrer noopener">
					 	<img src="@/assets/images/discord.svg" alt="" draggable="false" class="discord_logo" height="24">
						Join Discord</a>
					</button>
				</div>
			</div>
		</div>
	</div>
	<div class="card">
		<div class="card-content">
			<span class="card-title">Recent Connections</span>
		</div>
		<div class="loading_container" v-if="!controllingSessions">
			<Spinner />
		</div>
		<p v-else-if="controllingSessions && controllingSessions.length === 0" class="no_sessions">There are no recent connections to display</p>
		<div class="table_wrapper" v-else>
			<table class="medium hover striped">
				<thead>
					<th>Position</th>
					<th>Sign On</th>
					<th>Sign Off</th>
					<th>Length</th>
				</thead>
				<tbody>
					<tr v-for="session in controllingSessions" :key="session.timeStart">
						<td>{{session.position}}</td>
						<td>{{dtLong(session.timeStart)}}</td>
						<td>{{dtLong(session.timeEnd)}}</td>
						<td>{{sec2hms((new Date(session.timeEnd).getTime() - new Date(session.timeStart).getTime()) / 1000)}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { zabApi } from '@/helpers/axios.js';
export default {
	name: 'UserDash',
	title: 'Dashboard',
	data() {
		return {
			approvedAirports: ['MIA', 'FLL', 'OPF', 'FXE', 'TMB', 'TPA', 'SRQ', 'PIE', 'SPG', 'BKV', 'LAL', 'PMP', 'BCT', 'HST', 'MCF', 'PBI', 'SUA', 'FPR', 'VRB', 'RSW', 'APF', 'PGD', 'FMY', 'EYW', 'NQX'],
			token: '',
			discordConnected: false,
			controllingSessions: null,
		};
	},
	async mounted() {
		this.token = this.user.data.idsToken || 'None Set';
		await this.getDiscordStatus();
		await this.getControllingSessions();
	},
	methods: {
		async generateToken() {
			const { data: tokenRet } = await zabApi.post('/user/idsToken');
			if(tokenRet.ret_det.code === 200) {
				this.toastSuccess('Token successfully generated');
				this.token = tokenRet.data;
			} else {
				this.toastError(tokenRet.ret_det.message);
			}
		},
		async getDiscordStatus() {
			const { data: discordData } = await zabApi.get('/user/discord');
			this.discordConnected = discordData.data;
		},
		async getControllingSessions() {
			const { data: sessionData } = await zabApi.get('/user/sessions-cq');
			this.controllingSessions = sessionData.data;
		},
		showToken() {
			document.getElementById('token_wrap').classList.remove('hidden');
			document.getElementById('click_to_see').classList.add('hidden');
		},
		hideToken() {
			document.getElementById('token_wrap').classList.add('hidden');
			document.getElementById('click_to_see').classList.remove('hidden');
		},
		linkDiscord() {
			this.$router.push('/login/discord');
		},
		async unlinkDiscord() {
			const { data: unlinkData } = await zabApi.delete('/user/discord');
			if(unlinkData.ret_det.code === 200) {
				this.toastSuccess('Discord unlinked.');
				await this.getDiscordStatus();
			} else {
				this.toastError(unlinkData.ret_det.message);
			}
		},
		sec2hms(secs){
			const days = Math.floor(secs / 86400);
			const remainderSeconds = secs % 86400;
			const hms = new Date(remainderSeconds * 1000).toISOString().substring(11, 19);
			return hms.replace(/^(\d+)/, h => `${+h + days * 24}`.padStart(2, '0'));
		},
		formatDate(value) {
			const d = new Date(value);
			return d.toLocaleString('en-US', {month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',});
		},
		...mapActions('user', [
			'getUser'
		])
	},
	computed: {
		...mapState('user', [
			'user'
		]),
		hoursCalc() {
			let seconds = 0;
			for(const session of this.controllingSessions) {
				//if((Math.abs(new Date().getTime() - new Date(session.timeEnd).getTime()) / (1000 * 60 * 60 * 24) < 31)) {
					const newSeconds = (new Date(session.timeEnd) - new Date(session.timeStart)) / 1000;
					seconds += newSeconds;
				//}
			}
			return this.sec2hms(seconds);
		},
		calcControlDate() {
			let date = new Date(this.user.data.joinDate ?? Date.now());

			if(this.controllingSessions.length > 0 ) {
				let seconds = 0;
				for (const session of this.controllingSessions) {
					if(seconds < 10800 && this.approvedAirports.includes(session.position.slice(0, 3))) {
						const newSeconds = (new Date(session.timeEnd) - new Date(session.timeStart)) / 1000;
						seconds += newSeconds;
						date = new Date(session.timeEnd);
					}

					if(seconds >= 10800) {
						break;
					}
				}
			}

			date.setUTCDate(date.getUTCDate() + 31);
			return this.formatDate(date);
		}
	}
};
</script>

<style scoped lang="scss">
#token_wrap {
	background: $gray_light;
	padding: 0.25em 0.5em 0.35em 0.5em;
	border-radius: 2px;
	height: 32px;
	width: 100%;
	max-width: 400px;
	position: relative;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.30);

	&.hidden {
		code, .generate {
			display: none;

			i {
				display: none;
			}
		}
	}
	code {
		display: inline-block;
		border-radius: 0;
		padding-top: .1em;
		white-space: nowrap;
		overflow: auto;
		width: 90%;
	}

	.generate {
		border-radius: 0;
		width: 10%;
		text-align: right;

		i {
			font-size: 18px;
			margin-left: .25em;
			margin-top: .20em;
			vertical-align: top;
			user-select: none;
			cursor: pointer;
		}
	}
}

.section_title {
	user-select: none;
	color: #9E9E9E;
	font-size: .9rem;
	display: inline-block;

	&~.section_title {
		margin-top: 2em;
	}
}

#click_to_see {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	text-align: center;
	cursor: pointer;
	user-select: none;
	display: flex;
	align-items: center;
	justify-content: center;

	&.hidden {
		display: none;
	}
}

.discord_title {
	font-size: 0.85rem;

	&.connect {
		color: $accent-color;
	}
}

.discord_connect {
	.btn {
		padding-left: 2.5em;
	}

	.discord_logo {
		position: absolute;
		left: 0;
		margin-left: 6px;
		margin-top: 7px;
	}
}

.table_wrapper {
	overflow: auto;

	table {
		min-width: 100%;
	}
}

.no_sessions {
	padding: 0 1em 1em 1em;
	margin-top: -1em;
	font-style: italic;
}
</style>
