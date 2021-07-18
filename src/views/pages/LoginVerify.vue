<template>
	<div class="flex justify-center items-center flex-col h-screen bg-gray-50 dark:bg-gray-900">
		<AlbuquerqueLogo class="h-48 mx-auto" />
		<h3 class="my-4">
			Verifying Login...
		</h3>
		<Loading />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import zabApi from '@/helpers/zabApi';
import { mapActions } from 'vuex';

export default defineComponent({
	name: 'LoginVerify',
	async mounted() {
		const {data} = await zabApi.post('/user/login', {
			token: this.$route.query.token
		});
		if(data.ret_det.code === 200) {
			window.close();
		} else {
			// TODO: Handle login error
		}
	},
	methods: {
		...mapActions('user', ['loginUser']),
	}
});
</script>