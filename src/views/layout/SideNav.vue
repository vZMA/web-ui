<template>
	<div
		:key="sidebarKey"
		class="side-nav w-72 bg-gray-100 h-screen shadow-xl absolute flex flex-col dark:bg-primary dark:text-white"
	>
		<!-- Logo -->
		<router-link
			to="/"
			class="logo flex items-center p-4 hover:bg-gray-300 dark:hover:bg-primary-light"
		>
			<AlbuquerqueLogo class="w-12 max-w-full" />
			<h5 class="ml-4">
				Albuquerque ARTCC
			</h5>
		</router-link>
		<div class="nav-separator" />
		<!-- User Info -->
		<div v-if="userData">
			<div class="py-2 px-4 flex items-center user-info">
				<div>
					<h5 class="text-base font-bold">
						Alexandra Robison
					</h5>
					<h6 class="text-sm">
						Instructor
					</h6>
				</div>
				<button
					class="ml-auto"
					@click="logout"
				>
					<i class="mi">logout</i>
				</button>
			</div>
			<nav>
				<ul>
					<NavItem
						link="/dashboard"
						icon="radar"
						text="Controller Dashboard"
					/>
					<NavItem
						link="/instructor"
						icon="school"
						text="Instructor Dashboard"
					/>
					<NavItem
						link="/admin"
						icon="settings"
						text="Admin Dashboard"
					/>
				</ul>
			</nav>
		</div>
		<div v-else>
			<ul>
				<NavItem
					link="#"
					icon="login"
					text="Login"
					@click="login"
				/>
			</ul>
		</div>
		<div class="nav-separator" />
		<!-- Context Nav -->
		<div v-if="contextNav">
			<nav>
				<ul>
					<NavItem 
						v-for="nav in contextNav"
						:key="nav.link"
						:link="nav.link"
						:icon="nav.icon"
						:text="nav.text"
					/>
				</ul>
			</nav>
			<div class="nav-separator" />
		</div>
		<!-- Main Nav -->
		<nav>
			<ul>
				<NavItem
					link="/"
					icon="home"
					text="Home"
				/>
				<NavItem
					link="/controllers"
					icon="people"
					text="Controller Roster"
				/>
				<NavItem
					link="/controllers/staff"
					icon="supervisor_account"
					text="ARTCC Staff"
				/>
				<NavItem
					link="/events"
					icon="event"
					badge="1"
					text="Events"
				/>
				<NavItem
					link="/news"
					icon="article"
					text="News"
				/>
				<NavItem
					link="/documents"
					icon="description"
					text="Documents"
				/>
				<NavItem
					link="/downloads"
					icon="file_download"
					text="Downloads"
				/>
				<NavItem
					link="/feedback"
					icon="feedback"
					text="Feedback"
				/>
			</ul>
		</nav>
		
		<!-- Dark Mode -->
		<div class="px-4 py-2 mt-auto">
			<button @click="toggleDarkMode">
				<i class="mi">{{ useDarkMode?'dark_mode':'light_mode' }}</i>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import NavItem from '@/components/nav/NavItem.vue';

export default defineComponent({
	name: 'SideNav',
	components: {
		NavItem
	},
	data() {
		return {
			useDarkMode: (localStorage.getItem('darkMode') ?? 'false') === "true",
			contextNav: this.$route.meta.contextNav,
			sidebarKey: 0
		}
	},
	computed: {
		...mapState('user', ['userData']),
	},
	watch: {
		'$route.meta.contextNav': function() {
			this.contextNav = this.$route.meta.contextNav
		},
	},
	methods: {
		toggleDarkMode() {
			localStorage.setItem('darkMode', (localStorage.darkMode === 'true')?'false':'true');
			this.useDarkMode = !this.useDarkMode;
			window.dispatchEvent(new CustomEvent('darkMode'));
		},
		login() {
			const loginWindow = window.open(`https://login.vatusa.net/uls/v2/login?fac=ZAB&url=3`, 'Login', 'height=600,width=800')
			loginWindow?.addEventListener('beforeunload', () => {
				this.$nextTick(() => this.loginUser());
			})
		},
		async logout() {
			await this.logoutUser();
		},
		...mapActions('user', ['loginUser', 'logoutUser'])
	},
});
</script>

<style scoped>

/**
 * I was working on a collapsable sidebar. Want to revisit this at some point,
 * but I am done dealing with it for now. More important things to consider
 * right now.
 * @TODO: Collapsable sidebar
 */

/* .side-nav {
	transition: width .3s;
	overflow: hidden;
}

.logo h5 {
	transition: font-size 0.3s;
	white-space: nowrap;
}

.user-info h5, .user-info h6 {
	transition: font-size 0.3s;
	white-space: nowrap;
}

.side-nav[open], .side-nav:hover {
	@apply w-72;
}

.side-nav:not([open]) .logo h5 {
	font-size: 0;
}

.side-nav:not([open]) .user-info h5, .side-nav:not([open]) .user-info h6 {
	font-size: 0;
}

.side-nav:not([open]):deep(.nav-item) {
	font-size: 0;
}

.side-nav:not([open])+:deep(.main-content) {
	@apply pl-14;
}

.side-nav:hover:deep(.nav-item) {
	font-size: unset;
}

.side-nav:hover .logo h5 {
	@apply text-xl;
}
.side-nav:hover .user-info h5 {
	@apply text-base;
}
.side-nav:hover .user-info h6 {
	@apply text-sm;
} */

</style>