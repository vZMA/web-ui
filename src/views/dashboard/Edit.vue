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
					<a href="#!" @click="authorize()">Authorize</a>
					<div id="g_id_signout">Sign Out</div>
				</div>
				<div class="input-field col s12">
					<input type="submit" class="btn right" value="Update" />
				</div>
			</form>
		</div>
	</div>
</template>

<script>
//import {google} from 'googleapis';
//import {OAuth2} from 'google-auth-library';
import {mapState} from 'vuex';
import {zabApi} from '@/helpers/axios.js';

export default {
	data() {
		return {
			//oauth2client: null,
			form: {
				bio: '',
				userTimezone: '',
				GoogleClientId: '',
				googleApiAccessToken: '',
				googlaApiRefreshRoken: ''
			}
		};
	},
	async mounted() {
		// check for 'code' in inbound params.  This means we have a call back from Google.
		const urlParams = new URLSearchParams(window.location.search);
		const code= urlParams.get('code');
		
		this.form.bio = this.user.data.bio || '';
		this.form.userTimezone = this.user.data.userTimezone || '';
		this.form.GoogleClientId = this.user.data.GoogleClientId || '';
		this.$nextTick(() => {
			M.FormSelect.init(document.querySelectorAll('select'), {});
			M.textareaAutoResize(document.querySelector('textarea'));
			M.CharacterCounter.init(document.querySelector('textarea'));
			M.updateTextFields();
		});
		
		if (code){
			// exchange code for Tokens and store tokens.
			const tokenEndpoint = 'https://oauth2.googleapis.com/token';
			const data = new URLSearchParams();
			data.append('client_id', '508757888270-eudsgs85s1g4voef7g9uq9vnrv0ui52v.apps.googleusercontent.com');
			data.append('client_secret', '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');
			data.append('code', code);
			data.append('grant_type', 'authorization_code');
			data.append('redirect_uri', 'https://zmaartcc.net/dash/profile');

			// Send the POST request to exchange authorization code for tokens
			fetch(tokenEndpoint, {
				method: 'POST',
				body: data,
			})
			.then(response => response.json())
			.then(data => {
				this.form.googleApiAccessToken = data.access_token;
				this.form.googleApiRefreshToken = data.refresh_token;
				console.log('Access token:', data.access_token);
				console.log('Refresh token:', data.refresh_token);
				console.log('Expires in (seconds):', data.expires_in);
				this.updateProfile();
			})
			.catch(error => console.error(error));
		}

		
		},
	methods: {
		async authorize() {
					
			console.log("Authorize Google ID pressed")
				// gcreate google auth URL and Redirect
			const clientID = '508757888270-eudsgs85s1g4voef7g9uq9vnrv0ui52v.apps.googleusercontent.com';
			const redirectURI = 'https://zmaartcc.net/dash/profile';
			const scopes = 'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';

			// Build the authorization URL
			const authURL = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes}&access_type=offline`;

			window.location.href=authURL;
			},
		async updateProfile() {
			// Get google calendar token if the user changes his id or
			const {data} = await zabApi.put('/user/profile', this.form);
			if(data.ret_det.code === 200) {
				this.toastSuccess('Profile successfully updated');
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