<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">Edit Controller Profile</span>
			<form class="row row_no_margin user_info" @submit.prevent="updateProfile">
				<div class="input-field col s12">
					<textarea id="bio" class="materialize-textarea" data-length="2000" v-model="form.bio"></textarea>
					<label for="bio" class="active">Biography</label>
				</div>
				<!--
					<div class="input-field col s12 m6">
					<select id="timezone" required v-model="form.userTimezone" class="materialize-select">
						<option value="12">UTC+12</option>
						<option value="11">UTC+11</option>
						<option value="10">UTC+10</option>
						<option value="9">UTC+9</option>
						<option value="8">UTC+8</option>
						<option value="7">UTC+7</option>
						<option value="6">UTC+6</option>
						<option value="5">UTC+5</option>
						<option value="4">UTC+4</option>
						<option value="3">UTC+3</option>
						<option value="2">UTC+2</option>			
						<option value="1">UTC+1</option>			
						<option value="0">UTC</option>
						<option value="-1">UTC-1</option>
						<option value="-2">UTC-2</option>
						<option value="-3">UTC-3</option>
						<option value="-4">UTC-4</option>
						<option value="-5">UTC-5</option>
						<option value="-6">UTC-6</option>
						<option value="-7">UTC-7</option>
						<option value="-8">UTC-8</option>
						<option value="-9">UTC-9</option>
						<option value="-10">UTC-10</option>			
						<option value="-11">UTC-11</option>			
					</select>
					<label for="timezone" class="active">Timezone</label>
				</div>
			-->
				<div class="input-field col s12">
					<textarea id="googleid" class="materialize-textarea" data-length="256" v-model="form.GoogleClientId"></textarea>
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
//import {google} from 'googleapis';

export default {
	data() {
		return {
			form: {
				bio: '',
				userTimezone: '',
				GoogleClientId: ''
				
			}
		};
	},
	async mounted() {
		this.form.bio = this.user.data.bio || '';
		this.form.userTimezone = this.user.data.userTimezone || '';
		this.form.GoogleClientId = this.user.data.GoogleClientId || '';
		this.$nextTick(() => {
			M.FormSelect.init(document.querySelectorAll('select'), {});
			M.textareaAutoResize(document.querySelector('textarea'));
			M.CharacterCounter.init(document.querySelector('textarea'));
			M.updateTextFields();
		});
	},
	methods: {
		async updateProfile() {
			// Get google calendar token if the user changes his id or
			const {data} = await zabApi.put('/user/profile', this.form);
			if(data.ret_det.code === 200) {
				this.toastSuccess('Profile successfully updated');
			}
			/*	
			if (this.user.data.GoogleClientId != this.form.GoogleClientId)
				{
				const clientId = '508757888270-og0a2vc2gmcnopoa1rl8sdq1jkaoq4kh.apps.googleusercontent.com';
		        const clientSecret = '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';
        		const redirectUri = 'https://zmaartcc.net/connect/google';
        		const scopes = ['https://www.googleapis.com/auth/calendar.events'];

				const oauth2Client = new google.auth.OAuth2(
	          		clientId,
    	      		clientSecret,
        	  		redirectUri
        			);

        		const authUrl = oauth2Client.generateAuthUrl({
          			access_type: 'offline',
          			scope: scopes
        	});

        	window.location.href = authUrl;
			}*/
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