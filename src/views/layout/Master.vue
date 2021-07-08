<template>
	<div class="h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
		<SideNav />
		<main class="pl-72 h-screen flex flex-col main-content">
			<router-view class="flex-1" />
			<Footer />
		</main>	
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SideNav from './SideNav.vue'
import Footer from './Footer.vue'

export default defineComponent({
	name: 'Master',
	components: {
		SideNav,
		Footer
	}
});
</script>