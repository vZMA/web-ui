<template>
	<div>
		<div class="hero">
			<div class="py-12 blur-overlay relative">
				<h1 class="text-center text-white font-bold">
					Welcome to Albuquerque
				</h1>
				<h4 class="text-center text-white mt-2">
					Check density altitude
				</h4>
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

<style scoped>

.hero {
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
	background-image: url('/src/assets/images/hero/sandias.jpg');
	position: relative;
}

.hero::before {
	@apply bg-primary;
	opacity: 0.6;
	height: 100%;
	width: 100%;
	left: 0;
	top: 0;
	content: "";
	position: absolute;
}

.blur-overlay {
	backdrop-filter: blur(2px);
}

</style>