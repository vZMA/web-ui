<template>
	<div>
		<div class="card card_margin">
			<div class="card-content">
				<span class="card-title">ARTCC Staff</span>
				<div class="loading_container" v-if="!staff">
					<Spinner />
				</div>
				<div v-else>
					<div class="row">
						<div class="col s12 l4 push-l4">
							<StaffCard :staffItem="staff.atm" />
						</div>
					</div>
					<div class="row">
						<div class="col s1 push-s5 border_right hide-on-med-and-down"></div>
					</div>
					<div class="row">
						<div class="col s8 push-s2 border_top hide-on-med-and-down"></div>
					</div>
					<div class="row">
						<div class="col s1 push-s2 border_left hide-on-med-and-down"></div>
						<div class="col s5 border_right hide-on-med-and-down"></div>
						<div class="col s4 border_right hide-on-med-and-down"></div>
					</div>
					<div class="row">
						<div class="col s12 l4 push-l4">
							<StaffCard :staffItem="staff.datm" />
						</div>
						<div class="col s12 l4 pull-l4">
							<StaffCard :staffItem="staff.ta" />
						</div>
						<div class="col s12 l4">
							<StaffCard :staffItem="staff.wm" />
						</div>
					</div>
					<div class="row">
						<div class="col s1 push-s5 border_right border_long hide-on-med-and-down"></div>
					</div>
					<div class="row">
						<div class="col s6 push-s3 border_top hide-on-med-and-down"></div>
					</div>
					<div class="row">
						<div class="col s1 push-s3 border_left hide-on-med-and-down"></div>
						<div class="col s4 push-s4 border_right hide-on-med-and-down"></div>
					</div>
					<div class="row">
						<div class="col s12 l6">
							<StaffCard :staffItem="staff.ec" />
						</div>
						<div class="col s12 l6">
							<StaffCard :staffItem="staff.fe" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="card card_margin">
			<div class="card-content">
				<span class="card-title">Training Staff</span>
				<div class="loading_container" v-if="!staff">
					<Spinner />
				</div>
				<div v-else>
					<div class="row">
						<div class="col s12 l4 push-l4">
							<StaffCard :staffItem="staff.ta" />
						</div>
					</div>
					<div class="row">
						<div class="col s1 push-s5 border_right hide-on-med-and-down"></div>
					</div>
					<div class="row">
						<div class="col s6 push-s3 border_top hide-on-med-and-down"></div>
					</div>
					<div class="row">
						<div class="col s1 push-s3 border_left hide-on-med-and-down"></div>
						<div class="col s4 push-s4 border_right hide-on-med-and-down"></div>
					</div>
					<div class="row">
						<div class="col s12 l6">
							<StaffCard :staffItem="staff.ins" />
						</div>
						<div class="col s12 l6">
							<StaffCard :staffItem="staff.mtr" />
						</div>
						<div class="col s12 l6">
							<div class="card">
							<div class="card-content">
								<h5 class="staff_heading">ZMO ACAs</h5>
									<ul>
									 <li>Braden Vonderau</li>
									 <li>Eric Boxerman</li>
									</ul>
								</div>
								
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {zabApi} from '@/helpers/axios.js';
import StaffCard from './StaffCard.vue';

export default {
	name: 'Staff',
	title: 'Staff',
	data() {
		return {
			staff: null
		};
	},
	components: {
		StaffCard
	},
	async mounted() {
		const {data} = await zabApi.get('/controller/staff');
		this.staff =  data.data;
	}
};
</script>

<style scoped lang="scss">
.row, .col {
	padding: 0;
	margin: 0;
}

.card {
	z-index: 1;
}

.card-content {
	padding: 0.75em;
	text-align: center;
}
.staff_heading {
	margin-top: 0;
	font-size: 1rem;
	font-weight: 700;
}
.staff_email {
	display: inline-flex;
	align-items: center;
	margin-top: 0.5em;
	.material-icons {
		font-size: 16px;
		margin-top: 0.2em;
		margin-right: 0.2em;
	}
}
.staff_member {
	font-size: 1.2rem;
	font-weight: 600;
	display: block;
}
.staff_table {
	tr {
		border-bottom: none;
	}
	td {
		width: 8.333333333333333%;
		box-sizing: border-box;
		padding: .25em 1em;
		vertical-align: top;
	}
}

.border_right {
	border-right: 3px solid $primary-color;
	height: 30px;
}

.border_left {
	border-left: 3px solid $primary-color;
	height: 30px;
}

.border_long {
	height: 110px;
	margin-top: -85px;
	z-index: 0;
}

.border_top {
	border-top: 3px solid $primary-color;
}

.card_margin {
	margin: .5em 0 1em 0;
}

@media only screen and (max-width: 992px) {
	.card-content .card {
		width: 100%;
		margin: .5em 0 1em 0;
	}
} 
</style>
