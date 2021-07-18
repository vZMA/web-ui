<template>
	<div>
		<div class="hero">
			<div class="py-24 blur-overlay relative">
				<h1 class="text-center text-white font-bold">
					Welcome to Albuquerque
				</h1>
				<h4 class="text-center text-white mt-2">
					Check density altitude
				</h4>
			</div>
		</div>
		<div class="grid grid-cols-6 gap-4 p-4">
			<div class="col-span-4">
				<h2>
					Virtual Albuquerque ARTCC
				</h2>
				<h3>Should have made that left turn!</h3>
				<p>
					Welcome to the Virtual Albuquerque ARTCC on VATSIM. We are a group of aviation enthusiasts providing simulated Air Traffic Control services, operating on the VATSIM network, the Americas region and the United States division. The Albuquerque ARTCC covers most of Arizona and New Mexico, as well as parts of Texas, Colorado and Oklahoma.
				</p>
			</div>
			<div class="col-span-2">
				<h2>On the Network</h2>
				<h3>Come fly with us!</h3>
				<ul>
					<li class="flex items-center justify-between">
						<span>
							<strong>Alexandra Robison</strong>/I1
						</span>
						<span class="chip chip-primary">
							ABQ_CTR
						</span>
					</li>
					<li class="flex items-center justify-between pt-2 mt-2 border-t border-gray-300 dark:border-gray-600">
						<span>
							<strong>Vincent Eliezer De Guzman</strong>/S2
						</span>
						<span class="chip chip-primary">
							PHX_TWR
						</span>
					</li>
				</ul>
			</div>
			<div class="col-span-3">
				<h2>Events</h2>
				<h3>Quite eventful, huh?</h3>
				<div class="bg-gray-200 shadow-md dark:bg-primary-light p-4 hover:shadow-lg transition-shadow">
					<h4>Monsoon Madness!</h4>
					<h5 class="flex items-center text-lg font-bold mb-2">
						<i class="mi mr-2">calendar_today</i>August 8th, 2021
					</h5>
					<h5 class="flex items-center text-lg font-bold">
						<i class="mi mr-2">schedule</i>
						1700z
						<i class="mi mx-2 sm transform rotate-90">flight</i>
						2300z
					</h5>
				</div>
			</div>
			<div class="col-span-3">
				<h2>The Leaderboard</h2>
				<h3>Everyone needs a hobby.</h3>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Home',
});
</script>

<style lang="postcss" scoped>

.hero {
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
	background-image: url('/src/assets/images/hero/sandias.jpg');
	position: relative;
	&::before {
		@apply bg-primary;
		opacity: 0.6;
		height: 100%;
		width: 100%;
		left: 0;
		top: 0;
		content: "";
		position: absolute;
	}
}


.blur-overlay {
	backdrop-filter: blur(3px);
}

h2 {
	@apply font-extrabold mb-1 text-3xl;
}

h3 {
	@apply font-bold mb-2 text-lg text-primary-light dark:text-gray-400;
}

h4 {
	@apply font-extrabold mb-2 text-xl;
}

</style>