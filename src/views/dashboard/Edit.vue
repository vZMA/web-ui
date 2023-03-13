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
					<textarea id="timezone" class="materialize-textarea" data-length="3" v-model="form.userTimezone"></textarea>
					<label for="timezone" class="active">Biography</label>
				</div>
				<div class="input-field col s12">
					<textarea id="googleid"" class="materialize-textarea" data-length="256" v-model="form.GoogleId"></textarea>
					<label for="googleid" class="active">Biography</label>
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