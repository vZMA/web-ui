<template>
	<div class="card">
		<div class="card-content">
			<span class="card-title">Issue Solo Certification</span>
			<div class="spinner_wrapper" v-if="!controllers">
				<Spinner />
			</div>
			<div class="row row_no_margin" v-else>
				<div class="col s12 l6 push-l6 card_desc">
                    <p>
                        The issuance of a solo certification shall be in accordance with <b>section 8 of the Miami ARTCC
                        SOP</b>.
					<br><br>
                        Please ensure that the student's training records have been entered onto their ZMA and VATUSA
                        record <b>prior</b> to issuance of any solo certification.
					<br><br>
						Tier 2 Solo Certifications should be entered as 'ZMA_TWR', 'ZMA_APP', or 'ZMA_CTR'.
					<br><br>
                        Ensure that you enter solo certifications into the appropriate system in accordance with section
                        <b>8.4 of the Miami ARTCC SOP</b>. The student <i>cannot</i> take advantage of solo certifications that are
                        not entered correctly.
                    </p>
                </div>
				<form class="col s12 l6 pull-l6" @submit.prevent=submitCert>
					<div class="row row_no_margin">
						<div class="col s12 input-field">
							<select v-model="form.cid" required class="materialize-select">
								<option value="" disabled selected>Select a controller</option>
								<option v-for="controller in controllers" :value="controller.cid" :key="controller.cid">{{controller.fname}} {{controller.lname}}</option>
							</select>
							<label>Controller</label>
						</div>
						<div class="input-field col s12 m6">
							<select required v-model="form.position" class="materialize-select">
								<option value="" disabled selected>Select an option</option>
								<option value='PBI_TWR'>PBI_TWR</option>
								<option value='PBI_APP'>PBI_APP</option>
								<option value='RSW_APP'>RSW_APP</option>
								<option value='ZMA_CTR'>ZMA_CTR</option>
							</select>
							<label>Position</label>
						<!--<div class="col s12 input-field">
							<input id="position" type="text" minlength=3 maxlength=3 class="validate" placeholder="TWR" v-model="form.position" required>
							<label for="position" class="active">Position</label>-->
						</div>
						<div class="col s12 input-field">
							<input id="expiration_date" type="text" class="datepicker" ref="expirationDate" required>
							<label for="expiration_date">Expiration Date</label>
						</div>
						<div class="col s12 input-field">
							<input type="submit" class="btn" value="Submit" />
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
import {vatusaApiAuth, zabApi} from '@/helpers/axios.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default {
	name: 'NewSoloCert',
	title: 'Issue Solo Certification',
	data() {
		return {
			controllers: null,
			form: {
				cid: '',
				position: ''
			}
		};
	},
	async mounted() {
		await this.getControllers();

		const today = new Date(new Date().toUTCString());
		const future = new Date(new Date().toUTCString());

		flatpickr(this.$refs.expirationDate, {
			enableTime: false,
			minDate: today,
			maxDate: new Date(future.setDate(future.getDate() + 30)),
			disableMobile: true,
			dateFormat: 'Y-m-d',
			altFormat: 'Y-m-d',
			altInput: true,
		});
		
		M.FormSelect.init(document.querySelectorAll('.materialize-select'), {});
	},
	methods: {
		async getControllers() {
			const {data} = await zabApi.get('/feedback/controllers');
			this.controllers = data.data.filter(c => {
				return c.rating > 1 && c.vis == false;
			});
		},
		async submitCert() {
			console.log(this.form.position);
			try {
				await zabApi.post('/training/solo/'+this.form.cid,
						{
							cid: this.form.cid,
							position: this.form.position,
							expDate: this.$refs.expirationDate.value
						});
					if (this.form.position.slice(-3)==='APP' || this.form.position.slice(-3)==='CTR')		
						await vatusaApiAuth.post('/solo', 
							{
							cid: this.form.cid,
							position: this.form.position,
							expDate: this.$refs.expirationDate.value
							});
						

					this.toastSuccess('Solo Certification issued');

					this.$router.push('/ins/solo');
					this.$router.go();
				} catch(e) {
					this.toastError(e);
				}
			
		}
	}
};
</script>

<style scoped lang="scss">
.card_desc {
	margin-bottom: 1em;
}
</style>