<template>
	<div class="bg-gray-200 text-gray-900 text-sm p-4 dark:bg-gray-700 dark:text-white">
		<div>
			<p>This site is not affiliated with the FAA, or any governing aviation body. All content contained herein is approved only for use on the VATSIM network.</p>
			<p>This site works best in Google Chrome, Mozilla Firefox, and Microsoft Edge.</p>
			<p>If you are still using Internet Explorer, please consider switching to a more modern browser.</p>
		</div>
		<div class="mt-4 text-xs">
			<div class="flex items-center">
				<div class="flag flag-lgbt" />
				<div class="flag flag-trans" />
				<div class="flag flag-bi" />
			</div>
			<p class="mt-1">
				The Albuquerque ARTCC stands with the LGBTQIA+ community on VATSIM
			</p>
		</div>
	</div>
</template>

<style>

.flag {
	font-size: 8px;
	height: 2em;
	width: 3em;
}

.flag+.flag {
	margin-left: .5em;
}

.flag-lgbt {
	background: linear-gradient(180deg, #FE0000 16.66%,
	#FD8C00 16.66%, 33.32%,
	#FFE500 33.32%, 49.98%,
	#119F0B 49.98%, 66.64%,
	#0644B3 66.64%, 83.3%,
	#C22EDC 83.3%);
}

.flag-bi {
	background: linear-gradient(180deg, #D60270 40%, #9B4F96 40%, 60%, #0038A8 60%);
}

.flag-trans {
	background: linear-gradient(180deg, #5BCEFA 20%, #F5A9B8 20%, 40%, #FFFFFF 40%, 60%, #F5A9B8 60%, 80%, #5BCEFA 80%);
}

</style>