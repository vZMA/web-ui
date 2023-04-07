<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">Edit Controller Profile</span>
			<form class="row row_no_margin user_info" @submit.prevent="updateProfile">
				<div class="input-field col s12">
					<textarea id="bio" class="materialize-textarea" data-length="2000" v-model="form.bio"></textarea>
					<label for="bio" class="active">Biography</label>
				</div>
				<div class="input-field col s12">
					<textarea id="googleemail" class="materialize-textarea" data-length="256" v-model="form.googleEmail"></textarea>
					<label for="googleemail" class="active">Google Email</label>
					</div>
				<div>
					<p>To connect your Google account and authorize ZMA to post training events to your Google Calendar, please click the 'Authorize' button below.<br><br>
					You will be presented with a Google account login, followed by a permissions window.  Events will be created in the calendar when accepted by an instructor
					and will be modified or deleted as subsequent changes are made.<br><br></p>
					<p align="center"><a href="#!" @click="authorize()"><button type="button">Authorize</button></a></p><br>
				</div>
				<div class="input-field col s12">
					<textarea id="googlecalendarid" class="materialize-textarea" data-length="512" v-model="form.googleCalendarId"></textarea>
					<label for="googlecalendarid" class="active">Google Calendar to be updated</label>
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
			googleEmail: '',
			googleCalendarId: ''
		}
		};
	},
	async mounted() {
		// check for 'code' in inbound params.  This means we have a call back from Google.
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		
		console.log(this.user);
		this.form.bio = this.user.data.bio || 'Not set';
		this.form.googleEmail = this.user.data.googleEmail || 'Not set';
		this.form.googleCalendarId = this.user.data.googleCalendarId  || 'Primary';

		this.$nextTick(() => {
			M.FormSelect.init(document.querySelectorAll('select'), {});
			M.textareaAutoResize(document.querySelector('textarea'));
			M.CharacterCounter.init(document.querySelector('textarea'));
			M.updateTextFields();
		});
		
		if (code){
			// Call /user/google/token to exchange code for tokens
			const req = {
				cid: this.user.data.cid,
				code: code
			}
			this.googleCode=code;
	
			const { data } = await zabApi.post(`/user/google/token`, req);
			
			if(data.ret_det.code === 200) {
				this.toastSuccess('Google Calendar successfully authorized')
			}
		}
	},
	methods: {
		async authorize() {
			// Call /user/google/auth
			const { data } = await zabApi.get('/user/google/uri');
			let redirectUri ='';
	
			if(data.ret_det.code === 200) { 
				redirectUri = data.data.redirectUri;
			};
			
 			window.location.href=redirectUri;
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