<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">
				Create Staff Note
			</span>
			<div class="staff_notes" >
				<form id="new_note">
					<div class="row row_no_margin">
						<div class="input-field col s12">
							<textarea id="Description" class="materialize-textarea" data-length="50" v-model="description"></textarea>
							<label for="Description" class="active">Description<i class="material-icons tooltipped" data-position="right" data-tooltip="Description"></i></label>
						</div>
						<div class="input-field col s12">
							<textarea id="Note" class="materialize-textarea" data-length="3000" v-model="content"></textarea>
							<label for="Note" class="active">Note<i class="material-icons tooltipped" data-position="right" data-tooltip="Note"></i></label>
						</div>
						<!--<div class="input-field col s12">
							<textarea id="Tags" class="materialize-textarea" data-length="100" v-model="tags"></textarea>
							<label for="Tags" class="active">Tags<i class="material-icons tooltipped" data-position="right" data-tooltip="Tags"></i></label>
						</div>-->
					</div>
					<div class="row row_no_margin">
						<div class="input-field col s12 submit_buttons">
							<button type="button" class="btn right" @click="submitForm()">Save</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import {zabApi} from '@/helpers/axios.js';
import { mapState } from 'vuex';

export default {
	name: 'EditStaffNote',
	title: 'Edit Staff Note',
	data() {
		return {
			description: '',
			content: '',
			tags:'',
			authorCid: 0, //user.cid,
			cid: 0 // this.$route.params.cid
		};
	},
	async mounted() {
		this.authorCid = this.user.data.cid;
		this.cid = this.$route.params.cid;
		M.FormSelect.init(document.querySelectorAll('select'), {});
		M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
			margin: 0
		});
		M.CharacterCounter.init(document.querySelectorAll('textarea'), {});
	},
	methods: {
		async submitForm() {
			// We get here when the user pushes submit
			// Error check the fields
			if (!this.description) 
				this.toastError("Description is required");
			if (!this.content) 
				this.toastError("Notes are required");

			// if both keu fields have data, write it to the db
			if (this.content && this.description)
				{
				try {	// Hit the local database to Finalize the record
					const {data} = await zabApi.post(`controller/notes/createnote`, {
						cid: this.cid,
						description: this.description,
						content: this.content,
						tags: this.tags,
						authorCid: this.authorCid
					});
					if(data.ret_det.code === 200) {
					// Put a little message on screen saying success
						this.toastSuccess('Staff Note Submitted');					
						this.$router.push(`/admin/controllers/${this.$route.params.cid}`);
						}
					else {
						this.toastError(data.ret_det.message);	
					}
				} catch(e) {
					console.log(e);
					this.$router.push(`/admin/controllers/${this.$route.params.cid}`);			
				}
			}
		}
	},
	computed: {
		...mapState('user', [
			'user'
		])
	}		
}
</script>

<style scoped lang="scss">
label {
	.material-icons { 
		font-size: 17px;
		display: inline-flex;
		vertical-align: top;
		margin-top: .25em;
		user-select: none;
		cursor: pointer;
	}
}

.submit_buttons {
	input {
		margin-left: .5em;
	}
}
</style>
