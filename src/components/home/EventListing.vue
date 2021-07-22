<template>
	<h2>Events</h2>
	<h3>Quite eventful, huh?</h3>
	<div
		v-for="event in events"
		:key="event._id"
		class="bg-gray-200 shadow-md dark:bg-primary-light hover:shadow-lg transition-shadow"
	>
		<img
			:src="`${event.bannerUrl.match(/^http/) ? event.bannerUrl : `https://zabartcc.sfo3.digitaloceanspaces.com/events/${event.bannerUrl}`}`"
			class="event_banner max-w-full"
			draggable="false"
			loading="lazy"
			alt=""
		>
		<div class="p-4">
			<div class="flex items-center justify-between mb-2">
				<h4>{{ event.name }}</h4>
				<h5 class="flex items-center text-lg font-bold mb-2">
					<i class="mi mr-2">calendar_today</i>{{ L.fromISO(event.eventStart).toUTC().toFormat('LLLL dd, yyyy') }}
				</h5>
				<h5 class="flex items-center text-lg font-bold">
					<i class="mi mr-2">schedule</i>
					{{ L.fromISO(event.eventStart).toUTC().toFormat('HHmm') }}z
					<i class="mi mx-2 sm transform rotate-90">flight</i>
					{{ L.fromISO(event.eventEnd).toUTC().toFormat('HHmm') }}z
				</h5>
			</div>
			<p>{{ event.description }}</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DateTime as L } from 'luxon'

export default defineComponent({
	name: 'EventListing',
	inject: ['zabApi'],
	data() {
		return {
			events: null
		}
	},
	computed: {
		L: () => L
	},
	async mounted() {
		const {data: eventData} = await this.zabApi.get('/event');
		this.events = eventData.data
	}
});
</script>

<style scoped></style>