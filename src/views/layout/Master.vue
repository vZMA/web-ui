<template>
	<div
		v-if="appLoading" 
		class="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900"
	>
		<div class="shadow-lg p-8 text-center bg-white dark:bg-gray-500">
			<AlbuquerqueLogo class="h-72 mx-auto" />
			<h3 class="my-4">
				{{ loadingStatus }}<span class="blink">|</span>
			</h3>
			<Loading />
		</div>
	</div>
	<div
		v-else
		class="h-screen bg-gray-50 dark:bg-gray-900 dark:text-white"
	>
		<SideNav />
		<main class="pl-72 h-screen flex flex-col main-content">
			<router-view class="flex-1" />
			<Footer />
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import SideNav from './SideNav.vue'
import Footer from './Footer.vue'

export default defineComponent({
	name: 'Master',
	components: {
		SideNav,
		Footer
	},
	data() { 
		return {
			useDarkMode: false,
			appLoading: true,
			loadingStatus: "Please Wait...",
			backspacing: true
		}
	},
	computed: {
		...mapState('user', [
			'userData',
			'fetched'
		])
	},
	watch: {
		useDarkMode() {
			this.updateDarkMode();
		}
	},
	async mounted() {
		this.updateDarkMode();
		// await this.changeLoadingMessage('Getting dark mode preference...');
		window.addEventListener('darkMode', () => {
			this.useDarkMode = localStorage.getItem('darkMode') === "true";
		})
		// await this.changeLoadingMessage("Logging in...")
		await this.loginUser();
		// await this.changeLoadingMessage('Wrapping up...');
		this.appLoading = !this.fetched;
	},
	methods: {
		updateDarkMode() {
			const htmlRoot = document.querySelector('html');

			if(localStorage.darkMode === 'true' || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
				htmlRoot?.classList.add('dark');
				localStorage.setItem('darkMode', 'true');
				this.useDarkMode = true;
			} else {
				htmlRoot?.classList.remove('dark');
				localStorage.setItem('darkMode', 'false');
				this.useDarkMode = false;
			}
		},
		async changeLoadingMessage(to: string) {
			await new Promise(resolve => setTimeout(resolve, 500));
			let i = 1;
			const animate = (resolve) => {
				if(this.backspacing) {
					this.loadingStatus = this.loadingStatus.substring(0, this.loadingStatus.length - 1)
					if(!this.loadingStatus.length) {
						this.backspacing = false;
					}
				} else {
					this.loadingStatus = to.substring(0, i)
					i++;
				}
				if(this.loadingStatus !== to) {
					setTimeout(() => {
						animate(resolve);
					}, 25);
				} else {
					this.backspacing = true;
					resolve();
				}
			}
			return new Promise(resolve => animate(resolve));
		},
		...mapActions('user', ['loginUser'])
	}
});
</script>


<style lang="postcss">

.blink {
	animation-name: blink;
	animation-duration: 1s;
	animation-iteration-count: infinite;
	animation-timing-function: step-end;
}

@keyframes blink {
	from, to {
		opacity: 0;
	}
	50% {
		opacity: 1;
	}
}

</style>