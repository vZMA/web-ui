<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">Edit Controller Profile</span>
			<form class="row row_no_margin user_info" @submit.prevent="updateProfile">
				<div class="input-field col s12">
					<textarea id="bio" class="materialize-textarea" data-length="2000" v-model="form.bio"></textarea>
					<label for="bio" class="active">Biography</label>
				</div>
				<div class="input-field col s12 m6">
					<select required v-model="userTimezone" class="materialize-select">
						<option value="" disabled selected>Select a timezone</option>
						<option value=12>UTC+12</option>
						<option value=11>UTC+11</option>
						<option value=10>UTC+10</option>
						<option value=9>UTC+9</option>
						<option value=8>UTC+8</option>
						<option value=7>UTC+7</option>
						<option value=6>UTC+6</option>
						<option value=5>UTC+5</option>
						<option value=4>UTC+4</option>
						<option value=3>UTC+3</option>
						<option value=2>UTC+2</option>			
						<option value=1>UTC+1</option>			
						<option value=0>UTC</option>
						<option value=-1>UTC-1</option>
						<option value=-2>UTC-2</option>
						<option value=-3>UTC-3</option>
						<option value=-4>UTC-4</option>
						<option value=-5>UTC-5</option>
						<option value=-6>UTC-6</option>
						<option value=-7>UTC-7</option>
						<option value=-8>UTC-8</option>
						<option value=-9>UTC-9</option>
						<option value=-10>UTC-10</option>			
						<option value=-11>UTC-11</option>			
					</select>
					<label>Timezone</label>
				</div>
				<div class="input-field col s12">
					<textarea id="googleid" class="materialize-textarea" data-length="256" v-model="form.googleinfo.ClientId"></textarea>
					<label for="googleid" class="active">Google Username</label>
				</div>
				<div class="input-field col s12">
					<input type="submit" class="btn right" value="Update" />
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex';
import {zabApi} from '@/helpers/axios.js';

export default {
	data() {
		return {
			form: {
				bio: '',
				userTimezone: 0,
				googleinfo: { 
					clientId: ''
				}
			}
		};
	},
	async mounted() {
		this.form.bio = this.user.data.bio || '';
		this.form.userTimezone = this.user.data.userTimezone / 60;
		this.form.googleinfo.googleId = this.user.data.googleinfo.ClientId;
		this.$nextTick(() => {
			M.textareaAutoResize(document.querySelector('textarea'));
			M.CharacterCounter.init(document.querySelector('textarea'));
			M.updateTextFields();
		});
	},
	methods: {
		async updateProfile() {
			this.form.userTimezone *= 60;
			const {data} = await zabApi.put('/user/profile', this.form);

			if(data.ret_det.code === 200) {
				this.toastSuccess('Profile successfully updated');
			} else {
				this.toastError(data.ret_det.message);
			}
		}
	},
	computed: {
		...mapState('user', [
			'user'
		])
	},
};
</script>

<style scoped lang="scss">
.user_info {
	margin-top: 1em;
}
</style>