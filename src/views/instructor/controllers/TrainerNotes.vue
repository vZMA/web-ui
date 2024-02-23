<template>
    <div class="card" >
        <div class="no-trainernotes" v-if="!Trainer">
		</div>
		<div class="card-content" v-else>
			<span class="card-title">Trainer Notes</span>
		</div>
		<div v-if="Trainer===true">
			<table class="note_list striped">
				<thead class="note_list_head">
					<tr>
						<th>Subject</th>
						<th>Date</th>
						<th>Author</th>
						<th class="options">Options</th>
					</tr>
				</thead> 
				<tbody class="note_list_row">
					<tr v-for="(note, i) in notes" :key="note._id">
						<td class="name">
							{{ note.description }}
						</td>
						<td class="date">
							{{ dtLong(note.updatedAt) }}
						</td>
						<td>
							{{ note.author.fname +' '+note.author.lname }}
						</td>
						<td class="options">
							<a :href="`#modal_request_${i}`" data-position="top" data-tooltip="View Details" class="tooltipped modal-trigger">
									<i class="material-icons">search</i>
							</a>
						</td>
						<div :id="`modal_request_${i}`" class="modal modal_request">
							<div class="modal-content">
								<div class="modal_title">Staff Note</div>
								<div class="request">
									<div class="row row_no_margin" id="request">
										<div class="input-field description_wrapper col s12">
											<p id="subject">{{note.description ? note.description : '—'}}</p>
											<label for="description" class="active">Description</label>
										</div>
										<div class="input-field description_wrapper col s12">
											<p id="Note">{{note.content ? note.content : '—'}}</p>
											<label for="Note" class="active">Note</label>
										</div>
										<!--<div class="input-field description_wrapper col s12">
											<p id="tags">{{note.tags ? note.tags : '—'}}</p>
											<label for="tags" class="active">Tags</label>
										</div>-->
									</div>
								</div>
							</div>
						</div>
					</tr>
				</tbody>
			<td></td><td></td><td></td>
			<td>
			<div class="input-field col s12">
							<router-link :to="`/ins/controllers/newtnote/${this.cid}`" data-position="top" data-tooltip="Create New Note" class="tooltipped">
								<i class="waves-effect waves-light btn-small right">New Note</i>
							</router-link>
					</div>
					</td>
			</table>
			<div v-if="notes && notesAmount !== 0">
				<Pagination :amount="notesAmount" :page="page" :limit="limit" :amountOfPages="amountOfPages" />
			</div>
		</div>
	</div>
</template>

<script>
import {zabApi} from '@/helpers/axios.js';
import { mapState } from 'vuex';
import Pagination from '@/components/Pagination.vue';

export default {
	name: 'TrainerNotes',
	data() {
		return {
			cid: '',
			notes: null,
			notesAmount: 1,
			page: 1,
			limit: 10,
			amountOfPages: 1,
			Trainer: false
			};
	},
	components: {
		Pagination
	},
	async mounted() {
		//this.SnrStaff = this.user.data.roleCodes.includes('datm', 'atm', 'ta', 'wm');
		this.Trainer = ['datm', 'atm', 'ta', 'ins', 'mtr', 'wm'].some(code => this.user.data.roleCodes.includes(code));

		this.cid = this.$route.params.cid;
		await this.getTrainerNotes();

		M.Modal.init(document.querySelectorAll('.modal'), {
			preventScrolling: false
		});
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			margin: 0
		});
	},
	methods: { 
		async getTrainerNotes() { 
					
		const {data} = await zabApi.post('/controller/notes/gettnotes', {
					cid: this.cid,
					page: this.page,
					limit: this.limit
				});
			
			this.notes = data.data.notes;
			this.notesAmount = data.data.amount;
			this.amountOfPages = Math.ceil(this.noteAmount / this.limit);
		},
	},
	computed: {
		...mapState('user', [
			'user'
		])
	},

	watch: {
		page: async function() {
			await this.getTrainerNotes();
			M.Modal.init(document.querySelectorAll('.modal'), {
				preventScrolling: false
			});
			M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
				margin: 0
			});
		}
	}
}
</script>

<style scoped lang="scss">
.note_banner {
	width: 100%;
}

.note_list_row tr {
	transition: background-color .3s ease;
	&:hover {
		background: #eaeaea;
	}
}

.note_title {
	font-weight: 700;
}

.card .card-content .event_date {
	font-size: 1.15em; 
	margin-top: -15px;

	.rotate {
		transform: rotate(90deg);
	}
}

td {
	padding: 1em;
}

td a {
	transition: .3s;
	font-weight: 600;
	&:hover {
		color: $primary-color-light;
	}
}

.note_card .card-content .row {
	margin-bottom: 0;
}

.no_event {
	padding: 0 1em 1em 1em;
	margin-top: -1em;
	font-style: italic;
}
</style>