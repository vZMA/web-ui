<template>
	<li>
		<router-link
			class="flex items-center px-4 py-1 hover:bg-gray-300 dark:hover:bg-primary-light nav-item"
			:to="link"
		>
			<i class="mi mr-2">{{ icon }}</i>
			{{ text }}
			<span
				v-if="badge !== '0'"
				class="ml-auto text-xs px-2 py-1 bg-primary text-white dark:bg-accent"
			>{{ badge }}</span>
		</router-link>
	</li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'NavItem',
	props: {
		icon: {
			type: String, 
			required: true
		},
		text: {
			type: String, 
			required: true
		},
		link: {
			type: String, 
			required: true
		},
		badge: {
			type: String,
			default: "0"
		}
	}
});
</script>