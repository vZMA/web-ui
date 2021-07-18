<template>
	<div class="loading h-4 w-20">
		<span class="dot" />
		<span class="dot" />
		<span class="dot" />
		<span class="dot" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Loading',
});
</script>

<style lang="postcss" scoped>
	.loading {
		position: relative;
		display: inline-block;
	}

	.dot {
		position: absolute;
		top: 0;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		animation-timing-function: ease-in-out;
		animation-duration: 0.6s;
		animation-iteration-count: infinite;
		@apply bg-primary-light;

		&:nth-of-type(1) {
			left: .5rem;
			animation-name: dot1;
		}

		&:nth-of-type(2) {
			left: .5rem;
			animation-name: dot2;
		}
		&:nth-of-type(3) {
			left: 2rem;
			animation-name: dot2;
		}
		&:nth-of-type(4) {
			left: 3.5rem;
			animation-name: dot3;
		}
	}

	.loading-secondary .dot {
		@apply bg-secondary;
	}

	.loading-accent .dot {
		@apply bg-accent;
	}

	@keyframes dot1 {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
	@keyframes dot3 {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(0);
			opacity: 0;
		}
	}
	@keyframes dot2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}

</style>