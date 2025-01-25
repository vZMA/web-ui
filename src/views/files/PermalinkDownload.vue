<template>
	<div>
		<!-- Optional: Display a message while redirecting -->
		<p v-if="!file">Redirecting to your download...{{ permalink }}</p>
	</div>
</template>

<script>
import {zabApi} from '@/helpers/axios.js';

export default {
	name: 'PermalinkDownload',
	data() {
		return {
			file: null, // Holds the file data once fetched
		};
	},

	async mounted() {
		await this.getDownload(); // Fetch the file data and redirect
	},

	methods: {
		async getDownload() {
			try {
				// Fetch the file data using the permalink from the route
				const { data: fileData } = await zabApi.get(`/file/downloads/permalink/${this.$route.params.permalink}`);

				// Redirect to the file's download URL
				if (fileData?.data.fileName) {
					window.location.href = `https://zma-web.nyc3.digitaloceanspaces.com/downloads/${fileData.data.fileName}`;
				} else {
					console.error('File name not found in the response');
				}
			} catch (error) {
				console.error('Error fetching file data:', error);
				// Optionally handle errors, e.g., show an error message
			}
		},
	},
};
</script>

<style lang="scss" scoped>
/* Optional: Add styles for the loading message */
</style>
