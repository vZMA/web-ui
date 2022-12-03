<template>
	<div>
		<div class="card">
			<div class="card-content">
				<div class="row row_no_margin">
					<div class="card-title col s8"><span class="card-title">Solo Certifications</span></div>
					<div class="col s4"><router-link to="/ins/solo/new"><span class="btn new_cert_button right">New</span></router-link></div>
				</div>
			</div>
			<div class="loading_container" v-if="loading">
				<Spinner />
			</div>
			<p class="no_certs" v-else-if="loading === false && certs.length == 0">There are no active solo certifications issued by ZMA</p>
			<table class="certs_list striped compact" v-else>
				<thead class="certs_list_head">
					<tr>
						<th>Controller</th>
						<th>Position</th>
						<th>Expires</th>
						<th class="options">Options</th>
					</tr>
				</thead>
				<tbody class="certs_list_row">
					<tr v-for="(cert, i) in certs" :key="cert.id">
						<td><router-link :to="`/controllers/${cert.cid}`" class="controller_link">{{getName(cert.cid)}}</router-link></td>
						<td>{{cert.position}}</td>
						<td>{{cert.expires}}</td>
						<td class="options">
							<a :href="`#modal_delete_${cert.cid}`" data-position="top" data-tooltip="Delete Solo Cert" class="tooltipped modal-trigger"><i class="material-icons red-text text-darken-2">delete</i></a>
						</td>
						<div :id="`modal_delete_${cert.cid}`" class="modal modal_delete">
							<div class="modal-content">
								<h4>Delete Solo Cert?</h4>
								<p>This will remove the Solo Certification from VATUSA.</p>
							</div>
							<div class="modal-footer">
								<a href="#!" @click="deleteCert(cert.cid, cert.position)" class="btn waves-effect">Delete</a>
								<a href="#!" class="btn-flat waves-effect modal-close">Cancel</a>
							</div>
						</div>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import {vatusaAPIAuth, vatusaApi, zabApi } from '@/helpers/axios.js';

export default {
	name: 'SoloCerts',
	title: 'Solo Certifications',
	data() {
		return {
			positions: ['MIA', 'FLL', 'TPA', 'PBI', 'RSW', 'NQX', 'ZMO', 'CLT', 'DEN'],
			certs: [],
			controllers: null,
			loading: true
		};
	},

	async mounted() {
		await this.getSoloCerts();
		await this.getControllers();
		this.loading = false;

		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			margin: 0
		});	M.Modal.init(document.querySelectorAll('.modal'), {
			preventScrolling: false
		});


	},
	methods: {
	async getSoloCerts() {
				try {

					// Fetch and decode API data

					const {data} = await vatusaApi.get('/solo');
					const payload = atob(data.payload);
					var data1 = JSON.parse(payload);
					for (const cert of data1.data) {
						if(this.positions.includes(cert.position.slice(0, 3)))
							this.certs.push(cert);
					}

				} catch(e) {
					console.log(e);
				}
			},
			async getControllers() {
				try {
					const {data} = await zabApi.get('/feedback/controllers');
					this.controllers = data.data;
				} catch(e) {
					console.log(e);
				}
			},
			async deleteCert(cid, pos) {
				try {
					const formData = new FormData();
					formData.append('cid', cid);
					formData.append('position', pos);
					await vatusaApiAuth.delete('/solo', formData);

					this.toastSuccess('Solo Certification deleted');

					await this.getSoloCerts();
					this.$nextTick(() => {
						M.Modal.getInstance(document.querySelector('.modal_delete')).close();
					});

				} catch(e) {
					this.toastError('Something went wrong, please try again');
				}
			},
			getName(cid2) {
				const controller = this.controllers.filter(i => { return i.cid === cid2; });
				console.log(controller);
				return controller[0].fname + ' ' + controller[0].lname;
			}
		},
    watch: {
      page: async function() {
        await this.getSoloCerts();
        await this.getControllers();
        M.Modal.init(document.querySelectorAll('.modal'), {
          preventScrolling: false
        });
        M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
          margin: 0
        });
      }
    }
	};
</script>

<style scoped lang="scss">

table tbody {
	tr {
		transition: background-color .3s ease;
		&:hover {
			background: #eaeaea;
		}
	}
}

.no_certs {
	padding: 0 1em 1em 1em;
	margin-top: -1em;
	font-style: italic;
}

.controller_link {
	font-weight: 700;
	color: $primary-color;

	&:hover {
		color: $primary-color-light;
	}
}

.modal_delete {
	min-width: 400px;
	width: 30%;
}
</style>