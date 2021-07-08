<template>
	<div
		v-if="appLoading"
		class="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900"
	>
		<div class="shadow-lg p-8 text-center bg-white dark:bg-gray-500">
			<AlbuquerqueLogo class="h-72" />
			<h3 class="my-4">
				Please Wait...
			</h3>
			<Loading />
		</div>
	</div>
	<router-view v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Root',
	data() { 
		return {
			appLoading: false
		}
	},
});
</script>