<template>
	<div class="admin_sidebar card">
		<div class="collection">
			<router-link to="/ins" class="collection-item">
				Dashboard
				<div class="secondary-content"><i class="material-icons">home</i></div>
			</router-link>
			<router-link to="/ins/controllers" class="collection-item">
				Controllers
				<div class="secondary-content"><i class="material-icons">people</i></div>
			</router-link>
			<router-link to="/ins/solo" class="collection-item">
				Solo Certifications
				<div class="secondary-content"><i class="material-icons">streetview</i></div>
			</router-link>
			<!--<router-link to="/ins/training/requests" class="collection-item">
				Training Requests
				<div class="secondary-content"><i class="material-icons">event</i></div>
			</router-link>-->
			<router-link to="/ins/training/sessions" class="collection-item">
				Training Sessions
				<div class="secondary-content"><i class="material-icons">event_note</i></div>
			</router-link>
			<router-link to="/ins/training/allsessions" class="collection-item" >
				All Training Sessions
				<div class="secondary-content"><i class="material-icons">search</i></div>
			</router-link>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	methods: {
		requiresAuth(roles) {
			const havePermissions = roles.some(r => this.user.data.roleCodes.includes(r));
			if(havePermissions) {
				return true;
			} else {
				return false;
			}
		}
	},
	computed: {
		...mapState('user', [
			'user'
		])
	}
};
</script>

<style scoped lang="scss">
.card.admin_sidebar {
	// position: absolute;
	// top: 0;
	// left: 0;
	// width: 350px;
	// height: 100%;
	// background: $primary-color;
	// color: #fff;
	padding: 0;
}

.collection {
	border: none;
	margin: 0;
	border-radius: 0;

	.collection-header {
		padding: 10px 20px;
		margin: 0;
		font-weight: 700;
		border-bottom: 1px solid #e0e0e0;
		color: $primary-color;
	}

	.collection-item {
		color: $primary-color;
		
		.secondary-content {
			color: $primary-color;
		}

		i {
			margin-right: 10px;
		}

		&:not(.active):hover {
			background-color: $primary-color;
			color: #fff;

			.secondary-content {
				color: #fff;
			}
		}
	}
}
</style>